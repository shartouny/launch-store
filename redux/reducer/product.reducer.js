import { createSlice } from '@reduxjs/toolkit'

import { fetchProductById } from '../action/products.action'

export const productInfo = createSlice({
  name: 'productInfo',
  initialState: {
    product: {}
  },
  reducers: {
    addProduct: (state, action) => {
      return {
        ...state,
        product: action.payload
      }
    }
  }
})

export const addProductDetails = (id, slug) => async (dispatch) => {
  try {
    const response = await fetchProductById(id, slug)
    dispatch(productInfo.actions.addProduct(response.data))
    return response.data
  } catch (e) {
    throw { error: e.response.data.message, status: e.response.status }
  }
}

export default productInfo.reducer
