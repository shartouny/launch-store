import LoadingButton from '@components/button/LoadingButton'
import Checkout from '@components/checkout/Checkout'
import SuccessModal from '@components/modal/SuccessModal'
import Popup from '@components/popup/Popup'
import ShoppingCartItem from '@components/shoppingCart/ShoppingCartItem'
import { getLayout } from '@container/StoreLayout'
import { requestOrderCost } from '@redux/action/order.action'
import { purchase } from '@redux/reducer/shopping.reducer'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { withRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

const CheckoutPage = withRouter(({ router: { query, push } }) => {
  const { slug } = query
  const dispatch = useDispatch()
  const [validateOnChange, setValidateOnChange] = useState(false)

  const store = useSelector((state) => state.store)
  const childCompRef = useRef()
  const [checked, setCheck] = useState(true)

  const [extra, setExtra] = useState({
    shippingTotal: 0,
    tax: 0,
    countryCode: ''
  })
  const [paymentStep, setPaymentStep] = useState('Step1')

  const formik = useFormik({
    initialValues: {},
    validateOnChange: validateOnChange,
    validateOnMount: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('Required'),
      lastName: Yup.string().trim().required('Required'),
      email: Yup.string().trim().email('Invalid email address').required('Required'),
      shippingAddress: Yup.object({
        firstName: Yup.string().trim().required('Required'),
        lastName: Yup.string().trim().required('Required'),
        address: Yup.string().trim().required('Required'),
        phoneNumber: Yup.string().trim().required('Required'),
        city: Yup.string().trim().required('Required'),
        zipCode: Yup.string().trim().notRequired(),
        countryCode: Yup.string().trim().required('Required')
      }),
      billingAddress: Yup.object({
        firstName: checked ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        lastName: checked ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        address: checked ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        phoneNumber: checked ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        city: checked ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        zipCode: checked ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        countryCode: checked ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required')
      }),
      card: Yup.object({
        cardHolderName: paymentStep == 'Step1' ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        cardNumber: paymentStep == 'Step1' ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        expiry: paymentStep == 'Step1' ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required'),
        cvv: paymentStep == 'Step1' ? Yup.string().trim().notRequired() : Yup.string().trim().required('Required')
      })
    }),
    onSubmit: (values) => {
      if (paymentStep == 'Step1') {
        setPaymentStep('Step2')
        setValidateOnChange(false)
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      } else if (paymentStep == 'Step2') {
        // console.log('values', values)
        const { stripe, element } = childCompRef.current.createStripeElement()
        onReadyCheckout(values, stripe, element)

        // onReadyCheckout(values, stripe, element)
      }
    }
  })

  useEffect(() => {
    if (!isEmpty(formik.errors)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      onErrorCheckout('opss', 'Please fill all fields!')
    }
  }, [formik.submitCount])

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, { stripeAccount: store.stripe_connect_account })

  const [popup, setPopUp] = useState({
    isVisible: false,
    message: '',
    duration: 2000,
    onDismiss: () => setPopUp({ ...popup, isVisible: false })
  })

  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    message: 'Transaction Completed Successfully',
    buttonLabel: 'Back to Home page',
    duration: 2000,
    onDismiss: () => {
      setSuccessPopup({ ...successPopup, isVisible: false })
      push(`/store/${slug}`)
    }
  })

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  let cartItems = useSelector((state) => state.shopping.cart.filter((cart) => cart.storeSlug === slug))

  const cartSubtotal = cartItems.reduce((total, cartItem) => Number(cartItem?.cart?.variant[0]?.price) * Number(cartItem?.cart?.quantity) + total, 0).toFixed(2)

  const onConfirmationCheckout = () => {
    setPaymentStep('Step2')
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const onClickBackPayment = () => setPaymentStep('Step1')

  const onClickPayment = () => {
    formik.handleSubmit()
    setValidateOnChange(true)
  }

  const onErrorCheckout = (title, body) => setPopUp({ ...popup, isVisible: true, message: body })

  const onReadyCheckout = async (checkOut, stripe, element) => {
    setIsProcessingPayment(true)
    try {
      const payment_method = {
        card: element,
        billing_details: {
          name: checkOut.firstName,
          email: checkOut.email,
          phone: checkOut.phone
        }
      }
      const total = Number(cartSubtotal) + Number(extra?.shippingTotal) + Number(extra?.tax)
      checkOut.duplicateSwitch = checked
      await dispatch(purchase(slug, store.platform_store_id, total, checkOut, cartItems, payment_method, extra?.totalCost, 'usd', stripe))
      setSuccessPopup({ ...successPopup, isVisible: true })
    } catch (e) {
      setIsProcessingPayment(false)
      onErrorCheckout('Oops', e?.message)
    }
  }

  const onCountryChange = async (countryCode) => {
    try {
      const { data } = await requestOrderCost(countryCode, cartItems, slug)
      setExtra({ ...data, countryCode })
    } catch (e) {
      if (e.response.status == 403) push('/403')
    }
  }

  useEffect(() => {
    if (slug && cartItems && cartItems.length == 0 && !isProcessingPayment) push(`/store/${slug}/shopping-cart`)
  }, [cartItems, isProcessingPayment, slug, push])

  const onChangeChecked = () => setCheck(!checked)

  return (
    <div className={`mx-auto pt-20`}>
      {cartItems?.length > 0 && (
        <div className={'flex flex-col sm:flex-row'}>
          <div className="py-5 px-2 sm:px-0 sm:pr-24 sm:pl-24 mt-2 w-full fade-in-text">
            <Elements stripe={stripePromise}>
              <Checkout ref={childCompRef} formik={formik} onCheck={(check) => setCheck(check)} checked={checked} onClickPayment={onClickPayment} onChangeChecked={onChangeChecked} onConfirmation={onConfirmationCheckout} onError={onErrorCheckout} onReady={onReadyCheckout} onCountryChange={onCountryChange} onClickBack={onClickBackPayment} primaryHex={store?.theme?.primaryColor?.hex} isButtonLoading={isProcessingPayment} paymentStep={paymentStep} />
            </Elements>
          </div>
          <div className={'h-full bg-faGray'}>
            <div className={`px-2 sm:px-1 w-full py-5  sm:h-screen`}>
              <div className={'sm:pr-24 sm:pb-20 sm:pl-24'}>
                <p className="sm:-mx-0 mt-4 mb-8 text-2xl font-medium text-black">{'Order Summary'}</p>
                {!!cartItems.length && cartItems.map((cartItem, index) => <ShoppingCartItem active={false} key={index} data={cartItem.cart} />)}
                {!!cartItems.length && (
                  <div className={'sm:mt-5 w-full min-content'}>
                    <div className="px-1 sm:mb-10">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-normal">Subtotal</p>
                        <p className="font-normal text-md">${cartSubtotal}</p>
                      </div>
                      {!extra.countryCode && <div className="text-xs text-left">Taxes and shipping are calculated at country selection</div>}
                      {extra.countryCode == '' ? (
                        ''
                      ) : (
                        <div>
                          <div className="flex justify-between mb-2">
                            <p className="sm:text-base font-normal text-md">Shipping</p>
                            <p className="sm:text-base font-normal text-md">${extra?.shippingTotal}</p>
                          </div>
                          <div className="flex justify-between items-center border-gray-light border-solid">
                            <p className="sm:text-base font-normal text-md">Tax</p>
                            <p className="sm:text-base font-normal text-md">${extra?.tax}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-4 pb-4 mt-4 border-t-2 border-gray-light">
                        <p className="sm:-mx-0 text-2xl font-medium text-black">TOTAL</p>
                        <p className="sm:-mx-0 text-2xl font-medium text-black">${(Number(cartSubtotal) + Number(extra?.shippingTotal) + Number(extra?.tax)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 mx-4 ">
              <LoadingButton label={paymentStep == 'Step1' ? 'Continue to Payment' : 'Confirm'} isLoading={isProcessingPayment} onClick={onClickPayment} className="block sm:hidden px-3 mt-3 mb-3 w-full text-white bg-primary border-primary" loaderColor="white" minWidth="14rem" />
            </div>
          </div>
          <Popup message={popup.message} container={`top-24 sm:top-10`} visible={popup.isVisible} onDismiss={popup.onDismiss}></Popup>
        </div>
      )}
      <SuccessModal isVisible={successPopup.isVisible} message={successPopup.message} duration={successPopup.duration} iconColor={store?.theme?.primaryColor?.hex} onDismiss={successPopup.onDismiss} buttonLabel={successPopup.buttonLabel} redirectTo={`/store/${slug}`} />
    </div>
  )
})

CheckoutPage.getLayout = getLayout
export default CheckoutPage
