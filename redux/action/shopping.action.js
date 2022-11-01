import { requestGetSharedCart, requestSaveSharedCart } from '@utils/axiosconfig'
import * as CryptoJS from 'crypto-js'

export const requestShareCart = async (cartItems, slug) => {
  let hash = CryptoJS.MD5(JSON.stringify(cartItems)).toString()
  let data = JSON.stringify(cartItems)
  await requestSaveSharedCart('share-cart-data', { hash, data, slug })
  await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/store/${slug}/shopping-cart?r=${hash}`)
}
export const requestSharedCard = (hash, slug) => requestGetSharedCart('share-cart-data', { hash, slug })
