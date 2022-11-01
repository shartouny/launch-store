// import {HYDRATE} from "next-redux-wrapper";
import { createSlice } from '@reduxjs/toolkit'

import { fetchCategories, fetchProductByName, fetchProductsByCategoryId, fetchToken } from '../action/products.action'

const initStore = {
  categoryId: '1',
  categoryName: '',
  searchTerm: '',
  type: '',
  searchAutocomplete: [],
  isChangingCategory: false,
  sortValue: 0,
  categories: {
    current_page: 1,
    last_page: 1,
    data: []
  },
  products: {
    current_page: 1,
    last_page: 1,
    data: null
  }
}
export const productSlice = createSlice({
  name: 'product',
  initialState: {
    sortOptions: ['Price: High to Low', 'Price: Low to High', 'Alphabetical: A to Z', 'Alphabetical: Z to A'],
    slugs: {}
  },
  reducers: {
    openStore(state, action) {
      return { ...state, ...action.payload }
    },
    setCategories(state, action) {
      let slugs = {}
      slugs[action.payload.slug] = { ...initStore, ...action.payload }
      return { ...state, slugs }
    },
    setProducts(state, action) {
      let updateStore = {}
      let store = state.slugs[action.payload.slug]
      updateStore[action.payload.slug] = { ...store, ...action.payload }
      return { ...state, slugs: { ...state.slugs, ...updateStore } }
    },
    paginateProduct(state, action) {
      let updateStore = {}
      let store = state.slugs[action.payload.slug]
      let oldProducts = state.slugs[action.payload.slug].products
      let products = {
        current_page: action.payload.products.current_page,
        data: [...oldProducts.data, ...action.payload.products.data],
        last_page: action.payload.products.last_page
      }
      updateStore[action.payload.slug] = {
        ...store,
        products,
        categoryId: action.payload.categoryId
      }
      return { ...state, slugs: { ...state.slugs, ...updateStore } }
    },
    fillAutocomplete(state, action) {
      let updateStore = {}
      let store = state.slugs[action.payload.slug]
      updateStore[action.payload.slug] = {
        ...store,
        searchAutocomplete: action.payload.response.data
      }

      return { ...state, slugs: { ...state.slugs, ...updateStore } }
    },
    toggleLoader(state, action) {
      return {
        ...state,
        isChangingCategory: action.payload
      }
    }
  }
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {...state, ...action.payload.product};
  //   },
  //   ['SET_CLIENT_STATE']: (state, {type, payload}) => {
  //
  //   }
  // },
})

/**
 * Role : called on open redux to fetch token show all categories
 * @param slug
 * @returns {(function(*): Promise<*|undefined>)|*}
 */
export const openStore = (slug) => async (dispatch) => {
  try {
    const storeData = await fetchToken(slug)
    storeData.theme = JSON.parse(storeData.theme)
    const categories = await fetchCategories(slug)
    const categoryId = categories?.data[0]?.id
    const categoryName = categories?.data[0]?.name
    if (categoryId) {
      dispatch(
        productSlice.actions.setCategories(
          {
            slug,
            categories: { data: categories.data }
          },
          categoryId
        )
      )
      dispatch(showPageByCategory(slug, categoryId, '', 1, categoryName))
    } else {
      dispatch(productSlice.actions.setCategories(slug, { categories: { data: [] } }, ''))
      dispatch(
        productSlice.actions.setProducts({
          slug,
          products: {
            current_page: 0,
            data: [],
            last_page: 0
          },
          categoryId,
          sortValue: 0,
          searchAutocomplete: [],
          searchTerm: '',
          type: ''
        })
      )
    }
    return { categoryId, categoryName, storeData }
  } catch (e) {
    throw { status: e.response.status }
  }
}

/**
 * Role: Show PrimaryPage once user press on category options
 * @param categoryId
 * @param search
 * @param sort
 * @param slug
 * @param categoryName
 * @returns {(function(*): Promise<void>)|*}
 */
export const showPageByCategory = (slug, categoryId, search, sort, categoryName) => async (dispatch) => {
  if (categoryId)
    try {
      dispatch(productSlice.actions.toggleLoader(true))
      const products = await fetchProductsByCategoryId(categoryId, search, 1, sort, slug)

      if (categoryName)
        dispatch(
          productSlice.actions.setProducts({
            slug,
            products,
            categoryId,
            sortValue: sort,
            searchAutocomplete: [],
            searchTerm: search,
            categoryName,
            type: ''
          })
        )
      else
        dispatch(
          productSlice.actions.setProducts({
            slug,
            products,
            categoryId,
            sortValue: sort,
            searchTerm: search,
            searchAutocomplete: [],
            type: ''
          })
        )
      dispatch(productSlice.actions.toggleLoader(false))
    } catch (e) {}
}
/**
 * Role: Used to paginate product list
 * @param slug
 * @returns {(function(*): Promise<void>)|*}
 */
export const showPageOfProduct = (slug) => async (dispatch, getState) => {
  try {
    const data = getState()?.products?.slugs[slug]
    if (data) {
      const { categoryId, products, sortValue, categoryName } = data
      const { current_page } = products

      const response = await fetchProductsByCategoryId(categoryId, '', current_page + 1, sortValue, slug)
      dispatch(
        productSlice.actions.paginateProduct({
          slug,
          products: response,
          categoryId,
          sortValue,
          categoryName,
          searchTerm: '',
          type: ''
        })
      )
    }
  } catch (e) {}
}
/**
 *
 * @param slug
 * @param search
 * @param page
 * @param sort
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const showSearchProduct = (slug, search, page, sort) => async (dispatch, getState) => {
  const data = getState()?.products?.slugs[slug]

  if (data) {
    const products = await fetchProductByName(search, page, sort, slug)
    if (page < 2)
      dispatch(
        productSlice.actions.setProducts({
          slug,
          products,
          categoryId: '',
          sortValue: sort,
          searchTerm: search,
          searchAutocomplete: [],
          categoryName: '',
          type: 'search'
        })
      )
    else
      dispatch(
        productSlice.actions.paginateProduct({
          slug,
          products,
          categoryId: '',
          sortValue: sort,
          categoryName: '',
          searchTerm: search,
          searchAutocomplete: [],
          type: ''
        })
      )
  }
}

/**
 * Role : Used for auto-complete search in the NavBar Component
 * @param search
 * @param slug
 * @returns {(function(*): Promise<void>)|*}
 */
export const getAutoComplete = (slug, search) => async (dispatch) => {
  try {
    let response = await fetchProductByName(search, 1, 1, slug)
    response.searchTerm = search
    dispatch(productSlice.actions.fillAutocomplete({ slug, response }))
  } catch (e) {}
}

export default productSlice.reducer
