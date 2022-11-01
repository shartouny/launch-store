import { get } from '@utils/axiosconfig'

/**
 * Role : Bring the token from slug account on redux opens.
 * @param slug
 * @returns {Promise<unknown>}
 */
export const fetchToken = (slug) =>
  get(false, '', `${slug}`).then(({ data }) => {
    let tokens = {}

    try {
      const storeToken = JSON.parse(window.localStorage.getItem('tee-store-token'))
      tokens = { ...storeToken }
    } catch (e) {}
    tokens[slug] = data.store_token

    window.localStorage.setItem('tee-store-token', JSON.stringify(tokens))

    return Promise.resolve(data)
  })

/**
 * Name: fetchCategories
 * Role: Show the category by redux example a redux A can have 3 cat in the other hand another redux can have 4 cat.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const fetchCategories = (slug) => get(true, slug, 'v1/categories')

/**
 * Name: Fetch All Products base on
 * Role : this function is used
 * Fetch Product on open screen
 * Paginate
 * it took in considereation extra like sorrting algorithm and search item
 * @param categoryId
 * @param search
 * @param page
 * @param sort
 * @returns {Promise<{data: *, last_page: (number|*), current_page: (number|*)}>}
 */
export const fetchProductsByCategoryId = async (categoryId, search, page, sort, slug) => {
  const { data } = await get(true, slug, `v1/product/category/${categoryId}`, { search, page, sort })
  return {
    current_page: data.meta.current_page,
    last_page: data.meta.last_page,
    data: data.data
  }
}

/**
 * Role: Search for product by name without taking into consideration the category type
 * @param name
 * @returns {Promise<{data: *[], last_page: (number|*), current_page: (number|*)}>}
 */
export const fetchProductByName = async (terms, page, sort, slug) => {
  const { data } = await get(true, slug, `v1/product/search/${terms}`, { page, sort })
  return {
    current_page: data.meta.current_page,
    last_page: data.meta.last_page,
    data: data.data
  }
}

/**
 * Role : Find Product Details
 * @param id
 * @returns {Promise<{category_display: *, image: (*|string), price: *, name, options: {}, description: *, id, pictures}>}
 */
export const fetchProductById = (id, slug) => get(true, slug, `v1/product/${id}`)
