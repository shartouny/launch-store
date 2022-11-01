import MultiColorPicker from '@components/picker/MultiColorPicker'
import Popup from '@components/popup/Popup'
import { reset, setup } from '@redux/action/auth.action'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { httpMultiPart } from '@utils/axiosconfig'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { usePaymentInputs } from 'react-payment-inputs'
import Switch from 'react-switch'

import StripeCheckOut from '../components/checkout/StripeCheckOut'
import FileUploader from '../components/fileUploader/FileUploader'
import Input from '../components/input/Input'
import { isValidEmail } from '../utils/helper'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
export default function Register() {
  const router = useRouter()
  const storeRef = useRef()

  const [primaryColor, setPrimaryColor] = useState({
    hex: '#000000',
    rgb: {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    }
  })
  const [secondaryColor, setSecondaryColor] = useState({
    hex: '#C4C4C4',
    rgb: {
      r: 196,
      g: 196,
      b: 196,
      a: 1
    }
  })
  const [registrationStep, setRegistrationStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const { meta } = usePaymentInputs()

  const [formSubmit, setFormSubmit] = useState({
    storeName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    whiteLabelUrl: '',
    whiteLabel: false,
    logo: '',
    favIcon: ''
  })
  const [error, setError] = useState({
    storeName: false,
    fullName: false,
    email: false,
    phoneNumber: false,
    whiteLabelUrl: false
  })

  const [popup, setPopup] = useState({
    message: '',
    visible: false,
    duration: 2000,
    onDismiss: () => {
      setPopup({
        ...popup,
        visible: false,
        message: ''
      })
    }
  })

  const handleInputChange = (e) => {
    //override old visa card number length
    if (meta.cardType != undefined && meta.cardType.displayName == 'Visa') meta.cardType.lengths = [16]

    const { value, id, name, type } = e.target

    if (type == 'select-one') {
      setFormSubmit((prev) => {
        return {
          ...prev,
          [name]: value
        }
      })
    } else {
      setFormSubmit((prev) => {
        if (id == 'cvv')
          return {
            ...prev,
            [id]: !isNaN(value) ? value : value.substring(0, value.length - 1)
          }
        else
          return {
            ...prev,
            [id]: value
          }
      })
    }
  }

  const handleToggleChange = (checked) => {
    setFormSubmit((prev) => {
      return {
        ...prev,
        whiteLabel: checked
      }
    })
  }
  const handleFileUpload = (e) => {
    const { files, id } = e.target
    const allowArrayType = ['svg', 'png', 'jpg', 'jpeg']
    if (files && files.length) {
      const filename = files[0].name
      let parts = filename.split('.')
      const fileType = parts[parts.length - 1]
      if (allowArrayType.includes(fileType))
        setFormSubmit((prev) => {
          return {
            ...prev,
            [id]: files[0]
          }
        })
      else alert('file not image')
    }
  }
  const handleChangeStep2 = () => {
    let errors = {
      storeName: false,
      fullName: false,
      email: false,
      phoneNumber: false,
      whiteLabelUrl: false
    }

    if (formSubmit.storeName.trim() == '') {
      errors.storeName = true
      setPopup({
        ...popup,
        visible: true,
        message: 'please fill Store Name'
      })
    } else if (formSubmit.fullName.trim() == '') {
      errors.fullName = true
      setPopup({
        ...popup,
        visible: true,
        message: 'please fill Full Name'
      })
    } else if (formSubmit.email.trim() == '' || !isValidEmail(formSubmit.email.trim())) {
      errors.email = true
      setPopup({
        ...popup,
        visible: true,
        message: 'please fill  a valid Email'
      })
    } else if (formSubmit.phoneNumber.trim() == '') {
      errors.phoneNumber = true
      setPopup({
        ...popup,
        visible: true,
        message: 'please fill Phone Number'
      })
    } else if (formSubmit.whiteLabelUrl.trim() == '' && formSubmit.whiteLabel) {
      errors.whiteLabelUrl = true
      setPopup({
        ...popup,
        visible: true,
        message: 'please fill white Label URL'
      })
    } else {
      setRegistrationStep(2)
      setError(errors)
      return
    }
    setError(errors)
  }
  const handleChangeStep3 = () => {
    setRegistrationStep(3)
  }

  const checkOutClicked = async (event, stripe, cardElement) => {
    setIsLoading(true)
    event.preventDefault()
    const store = new FormData()
    store.append('storeName', formSubmit.storeName)
    store.append('fullName', formSubmit.fullName)
    store.append('email', formSubmit.email)
    store.append('phoneNumber', formSubmit.phoneNumber)
    store.append('whiteLabelUrl', formSubmit.whiteLabelUrl)
    store.append('whiteLabel', formSubmit.whiteLabel)
    store.append('logo', formSubmit.logo)
    store.append('favIcon', formSubmit.favIcon)
    store.append(
      'theme',
      JSON.stringify({
        primaryColor: {
          hex: primaryColor.hex,
          rgb: primaryColor.rgb
        },
        secondaryColor: {
          hex: secondaryColor.hex,
          rgb: secondaryColor.rgb
        }
      })
    )

    try {
      const { data } = await httpMultiPart(router.query.r, 'launch-app-install', store)
      const { status, token, platform_store_id } = data

      storeRef.current = platform_store_id

      if (status == 'success') {
        if (!stripe || !cardElement) return

        //create a payment method
        const payment = { type: 'card', card: cardElement }
        const { error, paymentMethod } = await stripe.createPaymentMethod(payment)

        if (!error) {
          //update the redux created by the 2.0 as welll add the a subscription with status active
          const { data } = await setup(token, paymentMethod.id, formSubmit)
          const { clientSecret } = data
          //confirm the payment this is required for 3Ds
          let response = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: formSubmit.email
              }
            }
          })

          if (!response.error) {
            setRegistrationStep(4)
            setTimeout(() => window.open(process.env.NEXT_PUBLIC_TEELAUNCH_URL + '/integrations?d=' + platform_store_id, '_self'), 5000)
          } else {
            await reset(token)
            setPopup({
              ...popup,
              visible: true,
              message: response.error?.message,
              duration: 5000
            })
          }
          setIsLoading(false)
        } else {
          setPopup({
            ...popup,
            visible: true,
            message: 'unable to launch your payment method',
            duration: 2500,
            onDismiss: () => {
              setPopup({
                ...popup,
                visible: false,
                message: ''
              })
              setIsLoading(false)
            }
          })
        }
      } else {
        setPopup({
          ...popup,
          visible: true,
          message: response.data.data,
          onDismiss: () => {
            setPopup({
              ...popup,
              visible: false,
              message: ''
            })
            setIsLoading(false)
          }
        })
      }
    } catch (e) {
      setPopup({
        ...popup,
        visible: true,
        message: JSON.stringify(e),
        duration: 2000,
        onDismiss: () => {
          setPopup({
            ...popup,
            visible: false,
            message: ''
          })
          setIsLoading(false)
        }
      })
    }
  }

  const onClickHere = () => window.open(process.env.NEXT_PUBLIC_TEELAUNCH_URL + '/integrations?d=' + storeRef.current, '_self')

  const stepRender = (
    <Elements stripe={stripePromise}>
      <div>
        {registrationStep == 1 ? (
          <div
            className="flex justify-center items-center h-screen"
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundImage: "url('/icons/website-icons/bg-step1.svg')"
            }}>
            <div
              className=" z-10 p-8 w-3/4 lg:w-1/3 bg-white rounded-md"
              style={{
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
              }}>
              <div className="w-full">
                <img src="/icons/launch-store-circular.svg" className="mx-auto w-1/3" alt="launch-icon" />
              </div>
              <div className="py-2 text-base font-medium">
                <sup className="text-red-500">*</sup>Store Name
              </div>
              <div>
                <Input id="storeName" value={formSubmit.storeName} onChangeHandler={handleInputChange} placeholder="Store Name" className={`h-10  w-full focus:outline-none   px-4 border  rounded-md ${error.storeName ? `border-red-500` : `border-colorC4C4C4`}`} />
              </div>
              <div className="py-2 text-base font-medium">
                <sup className="text-red-500">*</sup>Full Name
              </div>
              <div>
                <Input id="fullName" value={formSubmit.fullName} onChangeHandler={handleInputChange} placeholder="Full Name" className={`h-10  w-full focus:outline-none   px-4 border  rounded-md ${error.fullName ? `border-red-500` : `border-colorC4C4C4`}`} />
              </div>
              <div className="py-2 text-base font-medium">
                <sup className="text-red-500">*</sup>Email
              </div>
              <div>
                <Input id="email" value={formSubmit.email} onChangeHandler={handleInputChange} placeholder="Email" className={`h-10  w-full focus:outline-none   px-4 border  rounded-md ${error.email ? `border-red-500` : `border-colorC4C4C4`}`} />
              </div>
              <div className="py-2 text-base font-medium">
                <sup className="text-red-500">*</sup>Phone Number
              </div>
              <div>
                <Input id="phoneNumber" value={formSubmit.phoneNumber} onChangeHandler={handleInputChange} placeholder="Phone Number" className={`h-10  w-full focus:outline-none   px-4 border  rounded-md ${error.phoneNumber ? `border-red-500` : `border-colorC4C4C4`}`} />
              </div>
              {/* classname=flex justify-between items-center pt-5 pb-5 */}
              <div className="hidden">
                <div className="text-base font-medium">
                  White Label URL<span className="text-xs italic font-normal">(optional)</span>
                </div>
                <div>
                  <Switch
                    onChange={handleToggleChange}
                    checked={formSubmit.whiteLabel}
                    activeBoxShadow={'0 0 0 0'}
                    uncheckedIcon={false}
                    offColor="#C4C4C4"
                    // height="20px"
                    onColor="#000"
                    handleDiameter={22}
                    checkedIcon={false}
                  />
                </div>
              </div>
              {formSubmit.whiteLabel && (
                <div className="pb-5">
                  <div className="pb-2 text-base font-medium">
                    <sup className="text-red-500">*</sup>URL
                  </div>
                  <div>
                    <Input id="whiteLabelUrl" value={formSubmit.whiteLabelUrl} onChangeHandler={handleInputChange} placeholder="White Label URL" className={`h-10  w-full focus:outline-none   px-4 border  rounded-md ${error.whiteLabelUrl ? `border-red-500` : `border-colorC4C4C4`}`} />
                  </div>
                </div>
              )}
              <div>
                <button onClick={handleChangeStep2} className={`text-white bg-black h-10 sm:p-2 rounded-md font-semibold shadow-md w-full mt-5`}>
                  Go to settings
                </button>
              </div>
            </div>
          </div>
        ) : registrationStep == 2 ? (
          <div
            className="flex justify-center items-center h-screen"
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundImage: "url('/icons/website-icons/bg-step2.svg')"
            }}>
            <div
              className=" z-10 p-8 w-3/4 lg:w-1/3 bg-white rounded-md"
              style={{
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
              }}>
              <div className="w-full">
                <img src="/icons/launch-store-circular.svg" className="mx-auto w-1/3" alt="launch-icon" />
              </div>
              <div className="flex justify-between items-center py-5">
                <div>
                  <div className="pb-5 text-base font-medium">Store Logo Upload</div>
                  <div className="">
                    <FileUploader id="logo" icon={'icons/website-icons/upload.svg'} className={'my-1 mr-1 w-28'} handleFileUpload={handleFileUpload} placeholder="Select File" />
                  </div>
                </div>
                <div className="w-16">
                  <img src={formSubmit?.logo == '' ? '/icons/website-icons/icon-rounded.svg' : URL.createObjectURL(formSubmit.logo)} alt="store-icon" />
                </div>
              </div>
              <div className="flex justify-between items-center py-5">
                <div>
                  <div className="pb-5 text-base font-medium">Fav Icon Logo Upload</div>
                  <div className="">
                    <FileUploader id="favIcon" icon={'icons/website-icons/upload.svg'} className={'my-1 mr-1 w-28'} handleFileUpload={handleFileUpload} placeholder="Select File" />
                  </div>
                </div>
                <div className="w-16">
                  <img src={formSubmit?.favIcon == '' ? '/icons/website-icons/icon-rounded.svg' : URL.createObjectURL(formSubmit.favIcon)} alt="store-icon" />
                </div>
              </div>
              <div className="pt-5 pb-5 text-base font-medium">Store Color Palette</div>
              <div className="pb-10">
                <MultiColorPicker primaryColor={primaryColor} secondaryColor={secondaryColor} handlePrimaryColorChange={setPrimaryColor} handleSecondaryColorChange={setSecondaryColor} />
              </div>
              <div>
                <button onClick={handleChangeStep3} className={`text-white bg-black h-10 sm:p-2 rounded-md font-semibold shadow-md w-full`}>
                  Go to payment
                </button>
              </div>
              <div>
                <button onClick={() => setRegistrationStep(1)} className={`mt-2 font-semibold  w-full underline`}>
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : registrationStep == 3 ? (
          <div
            className="flex justify-center items-center h-screen"
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundImage: "url('/icons/website-icons/bg-step3.svg')"
            }}>
            <div
              className=" z-10 p-8 w-3/4 lg:w-1/3 bg-white rounded-md"
              style={{
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
              }}>
              <div className="w-full">
                <img src="/icons/launch-store-circular.svg" className="mx-auto w-1/3" alt="launch-icon" />

                <StripeCheckOut isLoading={isLoading} submitClicked={checkOutClicked}></StripeCheckOut>
                <button onClick={() => setRegistrationStep(2)} className={`mt-2 font-semibold  w-full underline`}>
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center items-center h-screen"
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundImage: "url('/icons/website-icons/bg-step4.svg')"
            }}>
            <div
              className=" flex z-10 flex-col justify-center items-center py-44 px-24 w-3/4 lg:w-1/3 bg-white rounded-md"
              style={{
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
              }}>
              <img src="/icons/website-icons/success.svg" className="w-16" alt="success-icon" />
              <div className="py-8 text-4xl font-bold">SUCCESS!</div>
              <div className="font-normal text-center pb-18">
                We are preparing your store,you will be redirected shortly.
                <br />
                if not click{' '}
                <span className="font-bold underline">
                  <a className={`cursor-pointer`} onClick={onClickHere}>
                    here
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Elements>
  )

  return (
    <div>
      <Popup message={popup.message} visible={popup.visible} duration={popup.duration} onDismiss={popup.onDismiss} />
      {stepRender}
    </div>
  )
}
