import axios from 'axios'

/**
 *
 * Role: create General Axios configuration
 * @param withToken
 * @returns {AxiosInstance}
 */
const http = (withToken, slug) => {
  let token = ''
  if (slug && slug.length > 0)
    try {
      token = JSON.parse(window.localStorage.getItem('tee-store-token'))[slug]
    } catch (e) {}

  const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/store`,
    timeout: 1000000,
    headers: withToken
      ? {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      : {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
  })

  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const {
          data: { store_token }
        } = await refreshAccessToken(slug)
        originalRequest.headers.Authorization = 'Bearer ' + store_token
        return axiosInstance(originalRequest)
      }
      return Promise.reject(error)
    }
  )

  return axiosInstance
}

const refreshAccessToken = async (slug) => {
  return axios
    .create({
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/store`,
      timeout: 1000000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .get(slug)
}

export const httpMultiPart = (authorization, path, data) => {
  return axios({
    method: 'post',
    url: `/api/${path}`,
    headers: {
      Authorization: authorization,
      'Access-Control-Allow-Origin': '*',
      'content-type': 'multipart/form-data'
    },
    data
  })
}

export const requestSaveSharedCart = (path, data) => {
  return axios({
    method: 'POST',
    url: `/api/${path}`,
    data
  })
}

export const requestGetSharedCart = (path, params) => {
  return axios({
    method: 'GET',
    url: `/api/${path}`,
    params
  })
}

export const httpAuthorizedRequest = (token) => {
  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/store`,
    timeout: 1000000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

export const post = (token, slug, path, params) => http(token, slug).post(path, params)

export const get = (token, slug, path, params) => http(token, slug).get(path, { params })

export const put = (token, slug, path, params) => http(token, slug).put(path, { params })
