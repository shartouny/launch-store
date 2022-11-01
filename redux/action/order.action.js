import { post, put } from '@utils/axiosconfig'

/**
 * This is used to calculate shupping tax total cost and total price
 * @param order
 * @param slug
 * @returns {*|Promise<AxiosResponse<any>>}
 */
export const requestOrderCost = (countryCode, cart, slug) => {
  const cartItems = cart?.map((item) => {
    return {
      variant: [item?.cart?.variant[0]?.id],
      quantity: item?.cart?.quantity
    }
  })
  return post(true, slug, 'v1/order/cost', { countryCode, cartItems })
}

/**
 * This used to create a payment secret.
 * @param amount
 * @param totalCost
 * @param currency
 * @param slug
 * @returns {*|Promise<AxiosResponse<any>>}
 */
export const requestCreateOrderPayment = (total_price, total_cost, currency, slug) =>
  post(true, slug, 'v1/order/payment/create', {
    total_price,
    total_cost,
    currency
  })

export const requestCreateOrder = (platformStoreId, total, checkOut, cardItems, slug) => {
  let random = new Date().getFullYear() + '' + new Date().getMonth() + '' + new Date().getDay() + '' + new Date().getHours() + '' + new Date().getMinutes() + '' + new Date().getSeconds() + '' + new Date().getMilliseconds()

  const lineItems = cardItems.map((item) => {
    return {
      product_id: item.cart.variant[0].platform_product_id,
      variant_id: item.cart.variant[0].platform_variant_id,
      cost: item.cart.variant[0].price,
      price: item.cart.variant[0].price,
      quantity: item.cart.quantity,
      sku: item.cart.variant[0].sku,
      title: item.cart.variant[0].name,
      img: item.cart.variant[0].image
    }
  })

  let order = {
    platform_store_id: platformStoreId,
    platform_order_id: random,
    platform_order_number: random,
    fulfillment_status: 'unfulfilled',
    total: total,
    status: 10,
    duplicate_switch: checkOut.duplicateSwitch,
    personal_info: {
      first_name: checkOut.firstName,
      last_name: checkOut.lastName,
      email: checkOut.email
    },
    shipping_address: {
      first_name: checkOut.shippingAddress.firstName,
      last_name: checkOut.shippingAddress.lastName,
      address1: checkOut.shippingAddress.address,
      phone_number: checkOut.shippingAddress.phoneNumber,
      city: checkOut.shippingAddress.city,
      zip: checkOut.shippingAddress.zipCode.toString(),
      country: checkOut.shippingAddress.countryCode
    },
    billing_address: {
      first_name: checkOut.duplicateSwitch ? checkOut.shippingAddress.firstName : checkOut.billingAddress.firstName,
      last_name: checkOut.duplicateSwitch ? checkOut.shippingAddress.lastName : checkOut.billingAddress.lastName,
      address1: checkOut.duplicateSwitch ? checkOut.shippingAddress.address : checkOut.billingAddress.address,
      phone_number: checkOut.duplicateSwitch ? checkOut.shippingAddress.phoneNumber : checkOut.billingAddress.phoneNumber,
      city: checkOut.duplicateSwitch ? checkOut.shippingAddress.city : checkOut.billingAddress.city,
      zip: checkOut.duplicateSwitch ? checkOut.shippingAddress.zipCode.toString() : checkOut.billingAddress.zipCode.toString(),
      country: checkOut.duplicateSwitch ? checkOut.shippingAddress.countryCode : checkOut.billingAddress.countryCode
    },
    line_items: lineItems
  }

  return post(true, slug, 'v1/order/create', order)
}

/**
 * This is used to delete a created order in case create payment or payment occure with failure
 * @param id
 * @param slug
 * @returns {*|Promise<AxiosResponse<any>>}
 */
export const requestDeleteOrder = (id, slug) => post(true, slug, `v1/order/delete/${id}`)

/**
 * This used to confirm that the order has been payed and verified
 * @param id
 * @param slug
 * @returns {*|Promise<AxiosResponse<any>>}
 */
export const requestUpdateOrder = (id, slug, payment_intent) => put(true, slug, `v1/order/${id}`, { payment_intent })

/**
 * The process works in the following way:
 * 1. create a order
 * 2. create an orderPayment (integrated with stripe)
 * 3. confirm orderPayment
 * 4. update order status
 * @param slug
 * @param platform_store_id
 * @param total
 * @param checkOut
 * @param cartItems
 * @param payment_method
 * @param totalCost
 * @param currency
 * @param stripe
 * @returns {Promise<*>}
 */
export const requestPurchase = async (slug, platform_store_id, total, checkOut, cartItems, payment_method, totalCost, currency, stripe) => {
  try {
    const {
      data: {
        order: { id }
      }
    } = await requestCreateOrder(platform_store_id, total, checkOut, cartItems, slug)

    try {
      const {
        data: { client_secret }
      } = await requestCreateOrderPayment(total, totalCost, currency, slug)
      const result = await stripe.confirmCardPayment(client_secret, { payment_method })
      const { paymentIntent } = result
      if (!result.error) return await requestUpdateOrder(id, slug, paymentIntent?.id)
      else throw { status: 404, message: 'unable to proceed, please contact with your card issuer' }
    } catch (e) {
      await requestDeleteOrder(id, slug)
      throw { status: 404, message: e.message ? e.message : 'unable to create your oder payment, please try again' }
    }
  } catch (e) {
    throw { status: 404, message: e.message ? e.message : 'unable to create an order, please try again' }
  }
}
