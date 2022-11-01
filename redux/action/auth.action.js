import { httpAuthorizedRequest, post } from '@utils/axiosconfig'

/**
 * Role Create the customer payment method and prepare the subscription
 * @returns {*|Promise<AxiosResponse<any>>}
 */
export const setup = (token, paymentId, store) => post(false, '', 'create/subscription', { token, paymentId, store })

export const reset = (token) => httpAuthorizedRequest(token).delete('v1/reset')
