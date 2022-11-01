import { createSlice } from '@reduxjs/toolkit'

export const storeSlice = createSlice({
  name: 'store',
  initialState: {
    store_slug: '',
    store_name: '',
    full_name: '',
    email: '',
    phone_number: '',
    white_label: '',
    white_label_url: '',
    logo: '',
    fav_icon: '',
    theme: '',
    isToCheckout: false,
    isLoading: true
  },
  reducers: {
    saveStoreData: (state, action) => {
      return {
        ...state,
        isLoading: false,
        ...action.payload
      }
    },
    changeCheckoutData: (state, action) => {
      return {
        ...state,
        isLoading: false,
        isToCheckout: action.payload
      }
    }
  }
})

export const saveStoreConfig = (config) => async (dispatch) => {
  try {
    dispatch(storeSlice.actions.saveStoreData(config))
  } catch (e) {}
}

export const changeCheckout = (config) => async (dispatch) => {
  try {
    dispatch(storeSlice.actions.changeCheckoutData(config))
  } catch (e) {}
}

export default storeSlice.reducer
