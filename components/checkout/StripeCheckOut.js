import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

import Loadingbutton from '../button/LoadingButton'
import Input from '../input/Input'

const StripeCheckOut = ({ isLoading, submitClicked }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [card, setCard] = useState({
    cardHolderName: ''
  })
  const [error, setError] = useState({
    cardNumber: false,
    expiry: false,
    cvv: false
  })

  const onCreditCardChange = (event) => {
    if (event.error && !error.cardNumber) setError({ ...error, cardNumber: true })
    else if (!event.error && error.cardNumber) setError({ ...error, cardNumber: false })
  }

  const onExpiryChange = (event) => {
    if (event.error && !error.expiry) setError({ ...error, expiry: true })
    else if (!event.error && error.expiry) setError({ ...error, expiry: false })
  }

  const onCVVChange = (event) => {
    if (event.error && !error.cvv) setError({ ...error, cvv: true })
    else if (!event.error && error.cvv) setError({ ...error, cvv: false })
  }

  const onChangeHolderName = ({ target: { value } }) => setCard({ ...card, cardHolderName: value })

  const submitPressed = (event) => submitClicked(event, stripe, elements.getElement(CardNumberElement))

  return (
    <div>
      <div className="mb-3">
        <div className="py-2 text-base font-medium">Card Holder Name</div>
        <div>
          <Input id="cardHolderName" value={card.cardHolderName} onChangeHandler={onChangeHolderName} placeholder="Card Holder Name" className={`pt-2.5 pb-2.5  w-full focus:outline-none   px-4 border  rounded-md ${error.cardHolderName ? `border-red-500` : `border-colorC4C4C4`}`} />
        </div>
      </div>

      <div className="mb-3">
        <div className="py-2 text-base font-medium">Card Number</div>
        <CardNumberElement className={`pt-3 pb-3 w-full focus:outline-none   px-4 border  rounded-md ${error.cardNumber ? `border-red-500` : `border-colorC4C4C4`}`} onChange={onCreditCardChange} options={cardPaymentStyle(true)} />
      </div>
      <div className="flex py-2 mb-3 space-x-2">
        <div className="flex-1">
          <CardExpiryElement onChange={onExpiryChange} className={`w-full pt-3 pb-3 focus:outline-none  px-4 border rounded-md bg-white ${error.expiry ? `border-red-500` : `border-colorC4C4C4`}`} options={cardPaymentStyle(true)}></CardExpiryElement>
        </div>
        <div className="flex-1">
          <CardCvcElement onChange={onCVVChange} options={cardPaymentStyle(false)} className={`w-full pt-3 pb-3 font-medium   focus:outline-none  px-4 border rounded-md bg-white ${error.cvv ? `border-red-500` : `border-colorC4C4C4`}`}></CardCvcElement>
        </div>
      </div>
      <div className={'py-1'}>
        <Loadingbutton label={'Launch'} isLoading={isLoading} onClick={submitPressed} loaderColor={'white'} className={`text-white bg-black h-10 sm:p-2 rounded-md font-semibold shadow-md w-full`}></Loadingbutton>
      </div>
    </div>
  )
}

const cardPaymentStyle = (withIcon) => {
  return {
    showIcon: withIcon,
    style: {
      base: {
        fontSize: '16px',
        fontFamily: 'inner, sans-serif',
        fontSmoothing: 'inner',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#EF4444'
      }
    }
  }
}

export default StripeCheckOut
