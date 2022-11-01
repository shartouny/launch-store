import LoadingButton from '@components/button/LoadingButton'
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { countries } from '@utils/constant'
import { forwardRef, useImperativeHandle } from 'react'
import SelectSearch, { fuzzySearch } from 'react-select-search/dist/cjs'
import Switch from 'react-switch'

import Input from '../input/Input'

// eslint-disable-next-line react/display-name
const Checkout = forwardRef(({ formik, checked, paymentStep, onChangeChecked, isButtonLoading, primaryHex, onCountryChange, onClickPayment, onClickBack }, ref) => {
  const elements = useElements()
  const stripe = useStripe()

  useImperativeHandle(ref, () => ({
    createStripeElement() {
      return { stripe, element: elements.getElement(CardCvcElement) }
    }
  }))

  const onChangeShippingCountry = (data, { value }) => {
    formik.setFieldValue('shippingAddress.countryCode', value)
    formik.validateField('shippingAddress.countryCode')
    onCountryChange(value)
  }

  const onChangeBillingCountry = (countryCode) => {
    formik.setFieldValue('billingAddress.countryCode', countryCode)
    formik.validateField('billingAddress.countryCode')
  }

  const onChangeCardHolderName = (cardHolderName) => {
    formik.setFieldValue('card.cardHolderName', cardHolderName)
    formik.validateField('card.cardHolderName')
  }

  const onChangeCreditCard = (event) => {
    if (event.error) {
      formik.setFieldValue('card.cardNumber', '')
      formik.validateField('card.cardNumber')
    } else {
      formik.setFieldValue('card.cardNumber', 'done')
      formik.validateField('card.cardNumber')
    }
  }

  const onChangeExpiryDate = (event) => {
    if (event.error) {
      formik.setFieldValue('card.expiry', '')
      formik.validateField('card.expiry')
    } else {
      formik.setFieldValue('card.expiry', 'done')
      formik.validateField('card.expiry')
    }
  }

  const onChangeCVC = (event) => {
    if (event.error) {
      formik.setFieldValue('card.cvv', '')
      formik.validateField('card.cvv')
    } else {
      formik.setFieldValue('card.cvv', 'done')
      formik.validateField('card.cvv')
    }
  }

  return (
    <div className="px-1 sm:mb-5">
      <div className="flex flex-col lg:flex-col sm:gap-10 justify-between items-center">
        {paymentStep == 'Step1' && (
          <div className="w-full">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }} className="my-2 sm:mb-6 text-black">
                Personal Information
              </div>
              <div className="grid grid-cols-2 gap-2 pb-2">
                <div>
                  <Input onBlur={formik.handleBlur} label="First Name" id="firstName" value={formik.values.firstName} style={{ borderColor: formik.errors.firstName ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-solid focus:outline-none text-s lg:text-md" />
                </div>

                <div>
                  <Input onBlur={formik.handleBlur} label="Last Name" id="lastName" value={formik.values.lastName} style={{ borderColor: formik.errors.lastName ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                </div>
                <div className="col-span-2">
                  <Input onBlur={formik.handleBlur} label="Email" id="email" value={formik.values.email} style={{ borderColor: formik.errors.email ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                </div>
              </div>
            </div>

            <div className="mt-2 w-full">
              <div style={{ fontWeight: 'bold', fontSize: '16px' }} className="my-2 sm:my-6 text-black">
                Shipping Address
              </div>
              <div className="grid grid-cols-2 gap-2 pb-2">
                <div className="">
                  <Input onBlur={formik.handleBlur} label="First Name" id="shippingAddress.firstName" value={formik.values?.shippingAddress?.firstName} style={{ borderColor: formik.errors.shippingAddress?.firstName ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-solid focus:outline-none text-s lg:text-md" />
                </div>
                <div className="">
                  <Input label="Last Name" onBlur={formik.handleBlur} id="shippingAddress.lastName" value={formik.values?.shippingAddress?.lastName} style={{ borderColor: formik.errors.shippingAddress?.lastName ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 pb-2">
                <div className="col-span-3">
                  <Input label="Address" onBlur={formik.handleBlur} id="shippingAddress.address" value={formik.values?.shippingAddress?.address} style={{ borderColor: formik.errors.shippingAddress?.address ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                </div>
                <div className="col-span-2">
                  <Input label="Phone Number" onBlur={formik.handleBlur} id="shippingAddress.phoneNumber" type="number" value={formik.values?.shippingAddress?.phoneNumber} style={{ borderColor: formik.errors.shippingAddress?.phoneNumber ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} onkeydown={(evt) => evt.key === 'e' && evt.preventDefault()} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2 pb-2">
                <div className="col-span-4">
                  <Input label="City" onBlur={formik.handleBlur} id="shippingAddress.city" value={formik.values?.shippingAddress?.city} style={{ borderColor: formik.errors.shippingAddress?.city ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                </div>

                <div className="col-span-2">
                  <Input label="Zip Code" onBlur={formik.handleBlur} type="number" id="shippingAddress.zipCode" value={formik.values?.shippingAddress?.zipCode} style={{ borderColor: formik.errors.shippingAddress?.zipCode ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                </div>
              </div>

              <label>
                Select Country
                <SelectSearch id={'shippingAddress.countryCode'} autoComplete="nope" className={`${formik.errors?.shippingAddress?.countryCode ? `select-search-error` : `select-search`} py-2 px-4 h-12 lg:h-12  rounded-md`} closeOnSelect={true} value={formik.values.shippingAddress?.countryCode} filterOptions={fuzzySearch} onChange={onChangeShippingCountry} options={countries} placeholder="Country" printOptions="auto" search label="Country" />
              </label>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }} className="my-2 sm:mt-6 text-black">
                Billing Address
              </div>
              <div className="flex space-x-2">
                <Switch checked={checked} onChange={onChangeChecked} activeBoxShadow="0 0 0 0" uncheckedIcon={false} offColor="#C4C4C4" onColor={primaryHex} handleDiameter={16} checkedIcon={false} height={20} width={40} />
                <span className=" my-auto text-sm text-gray-500">Use same as shipping details</span>
              </div>
            </div>
            {!checked && (
              <div className=" mt-8">
                <div className="grid grid-cols-2 gap-2 pb-2">
                  <div>
                    <Input label="First Name" onBlur={formik.handleBlur} id="billingAddress.firstName" value={formik.values?.billingAddress?.firstName} style={{ borderColor: formik.errors.billingAddress?.firstName ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-solid focus:outline-none text-s lg:text-md" />
                  </div>

                  <div>
                    <Input label="Last Name" onBlur={formik.handleBlur} id="billingAddress.lastName" value={formik.values?.billingAddress?.lastName} style={{ borderColor: formik.errors.billingAddress?.lastName ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full md:w-full lg:w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 pb-2">
                  <div className="col-span-3">
                    <Input label="Address" onBlur={formik.handleBlur} id="billingAddress.address" value={formik.values?.billingAddress?.address} style={{ borderColor: formik.errors.billingAddress?.address ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                  </div>

                  <div className="col-span-2">
                    <Input label="Phone Number" onBlur={formik.handleBlur} id="billingAddress.phoneNumber" type="number" value={formik.values?.billingAddress?.phoneNumber} style={{ borderColor: formik.errors.billingAddress?.phoneNumber ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} onkeydown={(evt) => evt.key === 'e' && evt.preventDefault()} className="py-2 px-4 w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 pb-2">
                  <div className="col-span-4">
                    <Input label="City" onBlur={formik.handleBlur} id="billingAddress.city" value={formik.values?.billingAddress?.city} style={{ borderColor: formik.errors.billingAddress?.city ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                  </div>
                  <div className="col-span-2">
                    <Input label="Zip Code" onBlur={formik.handleBlur} type="number" id="billingAddress.zipCode" value={formik.values?.billingAddress?.zipCode} style={{ borderColor: formik.errors.billingAddress?.zipCode ? 'red' : '#BDBDBD' }} onChangeHandler={formik.handleChange} className="py-2 px-4 w-full h-12 lg:h-12 rounded-md border border-gray-600 border-solid focus:outline-none text-s lg:text-md" />
                  </div>
                </div>
                <label>
                  Select Country
                  <SelectSearch autoComplete="nope" className={`${formik.errors.billingAddress?.countryCode ? `select-search-error` : `select-search`} py-2 px-4 h-12 lg:h-12  rounded-md`} closeOnSelect value={formik.values.billingAddress?.countryCode} filterOptions={fuzzySearch} onChange={onChangeBillingCountry} options={countries} placeholder="Country" printOptions="auto" search />
                </label>
              </div>
            )}
          </div>
        )}

        <div className="w-full">
          {paymentStep == 'Step2' && (
            <div className="pb-6 w-full">
              <div style={{ fontWeight: 'bold', fontSize: '16px' }} className=" my-4 sm:mb-6 text-black">
                Payment Information
              </div>
              <div className="flex pb-2 space-x-2">
                <div className="flex-1">
                  <Input value={formik?.card?.cardHolderName} id="card.cardHolderName" label="Card Holder Name" style={{ borderColor: formik.errors.card?.cardHolderName ? 'red' : '#BDBDBD' }} onChangeHandler={({ target: { value } }) => onChangeCardHolderName(value)} className="py-2 px-4 w-full h-12 lg:h-12 rounded border border-gray-600 border-solid focus:outline-none lg:text-md" />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label>
                    Card Number
                    <CardNumberElement options={styles.cardNumberOptions} className={`w-full pt-3 pb-3 font-medium   focus:outline-none  px-4 border border-gray-600 rounded border-solid  bg-white ${formik.errors.card?.cardNumber ? `border-red-500` : 'border-gray-BDBDBD'}`} onChange={onChangeCreditCard} />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-3 gap-2 py-2 mb-3">
                <div className="col-span-2">
                  <label>
                    Expiration Date (MM/YY)
                    <CardExpiryElement options={styles.cardNumberOptions} onChange={onChangeExpiryDate} className={`w-full pt-3 pb-3 font-medium   focus:outline-none  px-4 border border-gray-600 rounded border-solid  bg-white ${formik.errors.card?.expiry ? `border-red-500` : 'border-gray-BDBDBD'}`} />
                  </label>
                </div>
                <div className="col-span-1">
                  <label>
                    CVC
                    <CardCvcElement options={styles.cardNumberOptions} onChange={onChangeCVC} className={`w-full pt-3 pb-3 font-medium   focus:outline-none  px-4 border border-gray-600 rounded border-solid  bg-white ${formik.errors.card?.cvv ? `border-red-500` : 'border-gray-BDBDBD'}`} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden sm:block md:block lg:block ml-auto w-full">
        <div className="flex space-x-5">
          <div className="flex-1">
            <LoadingButton label={paymentStep == 'Step1' ? 'Continue to Payment' : 'Confirm'} isLoading={isButtonLoading} onClick={onClickPayment} className="mb-32 w-full text-white bg-primary" loaderColor="white" minWidth="14rem" />
          </div>
          {paymentStep == 'Step2' && (
            <div className="flex-1">
              <LoadingButton disabled={isButtonLoading} label={'Back'} className={`mb-32  mr-4 text-black bg-white shadow-none border-2  border-black w-full border-primary text-primary ${isButtonLoading ? 'hidden' : 'block'}`} isLoading={false} onClick={onClickBack} loaderColor="white" minWidth="14rem" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

const styles = {
  cardNumber: ``,
  cardNumberOptions: {
    showIcon: true,
    style: {
      base: {
        fontSize: '16px',
        fontFamily: 'inner, sans-serif',
        fontSmoothing: 'inner',
        color: '#424770',
        '::placeholder': {
          color: 'transparent'
        }
      },
      invalid: {
        color: '#EF4444'
      }
    }
  }
}

export default Checkout
