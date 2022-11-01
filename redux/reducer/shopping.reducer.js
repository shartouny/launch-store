import { requestSharedCard } from '@redux/action/shopping.action'
import { createSlice } from '@reduxjs/toolkit'

import { requestPurchase } from '../action/order.action'

export const shoppingSlice = createSlice({
  name: 'shopping',
  initialState: {
    cart: [],
    purchase: []
  },
  reducers: {
    addToCart: (state, action) => {
      const item = state.cart.filter((item) => item?.cart?.variant[0]?.id == action.payload.cart.variant[0].id)

      if (item.length > 0)
        return {
          ...state,
          cart: state.cart.map((item) =>
            item?.cart?.variant[0]?.id == action.payload.cart.variant[0].id
              ? {
                  ...item,
                  cart: {
                    ...item.cart,
                    quantity: item.cart.quantity + action.payload.cart.quantity
                  }
                }
              : item
          )
        }
      else return { ...state, cart: [...state.cart, action.payload] }
    },

    buyNow: (state, action) => {
      return { ...state, cart: [action.payload] }
    },

    removeFromCart: (state, action) => {
      const cart = state.cart.filter((item) => item?.cart.variant[0].id !== action.payload)
      return { ...state, cart }
    },
    updateCart: (state, action) => {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item?.cart?.variant[0]?.id == action.payload.id
            ? {
                ...item,
                cart: {
                  ...item.cart,
                  quantity: action.payload.quantity
                }
              }
            : item
        )
      }
    },
    addExtraCharge: (state, action) => {
      return {
        ...state,
        extra: { ...state.extra, ...action.payload.data }
      }
    },
    reset: () => {
      return {
        cart: [],
        purchase: []
      }
    },
    resetCart: (state, action) => {
      const cart = state.cart.filter((item) => item.storeSlug != action.payload)
      return {
        cart: cart,
        purchase: [],
        extra: {
          shippingTotal: 0,
          tax: 0
        }
      }
    },
    setSharedCart: (state, action) => {
      return {
        ...state,
        cart: action.payload
      }
    }
  }
})

export const addCartList = (item) => async (dispatch) => {
  try {
    dispatch(shoppingSlice.actions.addToCart(item))
  } catch (e) {}
}
export const buyNow = (item) => async (dispatch) => {
  try {
    dispatch(shoppingSlice.actions.buyNow(item))
  } catch (e) {}
}
export const removeItemFromCart = (item) => (dispatch) => {
  try {
    dispatch(shoppingSlice.actions.removeFromCart(item))
  } catch (e) {}
}

export const updateCardCount = (item) => (dispatch) => {
  try {
    dispatch(shoppingSlice.actions.updateCart(item))
  } catch (e) {}
}

/**
 * the role of this function is to get  data from linked shared throw get api
 * @param r
 * @param slug
 * @returns {(function(*, *): Promise<string|undefined>)|*}
 */
export const sharedCart = (r, slug) => async (dispatch, getState) => {
  try {
    const { data } = await requestSharedCard(r, slug)
    const carts = getState().shopping?.cart?.filter((item) => item.storeSlug != slug)
    if (carts) dispatch(shoppingSlice.actions.setSharedCart([...carts, ...data]))
    else dispatch(shoppingSlice.actions.setSharedCart(data))
    return 'success'
  } catch (e) {}
}

/**
 * The role of this function is purchase a cart list item
 * @param slug
 * @param platform_store_id
 * @param total
 * @param checkOut
 * @param cartItems
 * @param payment_method
 * @param totalCost
 * @param usd
 * @param stripe
 * @returns {(function(*): Promise<void>)|*}
 */
export const purchase = (slug, platform_store_id, total, checkOut, cartItems, payment_method, totalCost, usd, stripe) => async (dispatch) => {
  try {
    await requestPurchase(slug, platform_store_id, total, checkOut, cartItems, payment_method, totalCost, usd, stripe)
    dispatch(shoppingSlice.actions.reset(slug))
  } catch (e) {
    throw e
  }
}

export default shoppingSlice.reducer
