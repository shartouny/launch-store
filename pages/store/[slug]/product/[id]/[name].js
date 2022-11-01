import PaymentButton from '@components/button/PaymentButton'
import SizingChart from '@components/charts/SizingChart'
import ShoppingCart from '@components/icons/shoppingCart'
import PhotoSlider from '@components/photo/PhotoSlider'
import ColorPicker from '@components/picker/ColorPicker'
import CounterPicker from '@components/picker/CounterPicker'
import ItemPicker from '@components/picker/ItemPicker'
import SizePicker from '@components/picker/SizePicker'
import Popup from '@components/popup/Popup'
import { getLayout } from '@container/StoreLayout'
import { addProductDetails } from '@redux/reducer/product.reducer'
import { addCartList, buyNow } from '@redux/reducer/shopping.reducer'
import { capitalizeFirstLetter } from '@utils/formatter'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Product = withRouter(({ router: { query, push } }) => {
  const { slug, id } = query
  const dispatch = useDispatch()
  const product = useSelector((state) => state.product.product)
  const [popup, setPopup] = useState({
    message: '',
    visible: false,
    duration: 750,
    onDismiss: () => {
      setPopup({ ...popup, visible: false, message: '' })
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const [cart, setCart] = useState({
    options: [],
    isAvailable: true,
    itemsPicked: {},
    totalOptions: -1,
    variant: [],
    price: -1,
    quantity: 1
  })

  const [tab, setTab] = useState({
    isActive: false,
    position: 1
  })
  const storeId = useSelector((state) => state.store?.platform_store_id)

  useEffect(() => {
    const showProduct = async () => {
      try {
        if (id && storeId) {
          const product = await dispatch(addProductDetails(id, slug))

          const product_options = product.options?.filter((item) => item.type.toLowerCase() !== 'color')

          const itemPicked = {}

          let options
          if (product_options?.option?.length != 1)
            options = product_options.map((item) => {
              itemPicked[item.type.toLowerCase()] = item.values[0]
              return {
                id: item.id,
                type: item.type.toLowerCase(),
                values: item.values[0].name
              }
            })
          else
            options = product_options.map((item) => {
              itemPicked[item.type.toLowerCase()] = item.values[0]
              return {
                id: item.id,
                type: item.type.toLowerCase(),
                values: item.values[0].name,
                variant: [product.variants[0]]
              }
            })

          setCart({
            isAvailable: true,
            totalOptions: -1,
            price: -1,
            quantity: 1,
            itemsPicked: itemPicked,
            options: options,
            variant: [product.variants[0]]
          })
          setIsLoading(false)
        }
      } catch (e) {
        if (e?.status != 403) push(`/store/${slug}/404`)
        else push('/403')
      }
    }
    showProduct(id, storeId).then().catch()
  }, [dispatch, id, push, slug, storeId])

  const onQuantityPressed = (count) => setCart({ ...cart, quantity: count })

  const onOptionPressed = (key, value) => {
    const product_options = product.options?.filter((item) => item.type.toLowerCase() == key.toLowerCase())

    const option_selected = product_options[0]?.values.filter((option) => option.id == value.id)

    const option = { id: id, type: key, values: option_selected[0].name, hex_code: value.hex_code }

    const options = cart.options.filter((item) => item.type.toLowerCase() !== key.toLowerCase())

    options.push(option)

    const values = options.map((item) => item?.values)

    const variant_picked = product?.variants?.filter((variant) => variant.optionValues.every((option) => values.includes(option)))

    let itemPicked = cart.itemsPicked

    itemPicked[key.toLowerCase()] = value

    if (variant_picked && variant_picked?.length > 0)
      setCart({
        ...cart,
        options: options,
        variant: variant_picked,
        itemsPicked: itemPicked,
        price: variant_picked[0].price,
        totalOptions: 0,
        isAvailable: true
      })
    else
      setCart({
        ...cart,
        options: options,
        variant: variant_picked,
        itemsPicked: itemPicked,
        totalOptions: 0,
        isAvailable: values.length == product.total_options ? false : true
      })
  }
  //check the attributes of the product before sending it to cart
  const isReadyToCart = () => {
    if (product.options.length > 0) {
      const required_options = product?.options.map((item) => item?.type.toLowerCase())
      const selected_options = cart?.options.map((item) => item?.type.toLowerCase())
      if (selected_options.length == required_options.length) {
        return {
          options: cart.options,
          product_id: product.product_id,
          variant: cart.variant,
          quantity: cart.quantity
        }
      } else {
        const missing_option = required_options.filter((option) => !selected_options.includes(option))
        setPopup({
          ...popup,
          message: 'Please choose a ' + missing_option[0],
          visible: true
        })
        return false
      }
    } else {
      return {
        options: product.options,
        product_id: product.product_id,
        variant: product.variants,
        quantity: cart.quantity
      }
    }
  }
  const onClickAddToCart = () => {
    const toCart = isReadyToCart()
    if (!!toCart && !isButtonClicked) {
      setIsButtonClicked(true)
      dispatch(addCartList({ storeSlug: slug, cart: toCart }))
      setPopup({
        ...popup,
        message: product?.title + ' added to cart',
        visible: true,
        onDismiss: () => {
          setPopup({
            visible: false,
            message: ''
          })
          push(`/store/${slug}/shopping-cart`)
        }
      })
    }
  }
  const onClickBuyNow = () => {
    const toCart = isReadyToCart()
    if (!!toCart) {
      dispatch(buyNow({ storeSlug: slug, cart: toCart }))
      push(`/store/${slug}/checkout`)
    }
  }

  const onClickSizingChart = () => setTab({ ...tab, visible: true, tab: 2 })

  const ProductOptions = ({ options }) => {
    return (
      <div className={`w-full`}>
        {options?.map((item, index) => {
          if (item?.type?.toLowerCase() == 'color')
            return (
              <div key={'' + index} className=" my-2.5">
                <div className={'py-2 text-sm sm:text-lg font-bold color262626'}>Color</div>
                <div key={index} className={'flex flex-row'}>
                  <ColorPicker
                    containerStyle={''}
                    colors={item?.values}
                    colorSelected={cart?.itemsPicked['color']?.id}
                    onItemPicked={(value) => {
                      onOptionPressed('color', value)
                    }}
                  />
                </div>
              </div>
            )
          else if (item?.type?.toLowerCase() == 'size') {
            return (
              <div key={index} className={'my-2.5 '}>
                <div className={'py-2 text-base sm:text-lg font-bold color262626'}>Size</div>
                <SizePicker itemSelected={cart?.itemsPicked['size']?.id} style={'my-2.5'} data={item?.values} onItemPressed={(item) => onOptionPressed('size', item)} />
              </div>
            )
          } else {
            return (
              <div key={index} className={'my-2.5 '}>
                <p className={'py-2 text-base sm:text-lg font-bold color262626'}>Select {capitalizeFirstLetter(item?.type, 0)}</p>
                <ItemPicker value={cart?.itemsPicked[item.type.toLowerCase()] ? cart?.itemsPicked[item.type.toLowerCase()] : item?.values[0]} truncate={false} data={item?.values} className={'w-64'} onItemSelected={(value) => onOptionPressed(item?.type, value)} />
              </div>
            )
          }
        })}
      </div>
    )
  }

  return !isLoading && product?.hasOwnProperty('price') ? (
    <div className="sm:container pt-20 mx-auto">
      <meta name="title" content={product?.title}></meta>
      <meta name="description" content={product?.description}></meta>
      <Popup message={popup.message} visible={popup.visible} duration={popup.duration} onDismiss={popup.onDismiss} />
      <div className={'lg:flex lg:flex-col justify-center lg:mx-32 h-full'}>
        <div className="py-4 mx-2 sm:mx-0">
          <Link href={`/store/${slug}`} passHref={true}>
            <span className="text-base sm:text-lg text-gray-500 cursor-pointer">{product?.category?.name && product?.category?.name?.toLowerCase() != 'new' ? product?.category?.name + ' >' : 'N/A'}</span>
          </Link>
          <span className="text-sm sm:text-base text-primary"> {product?.title}</span>
        </div>
        <div className={'flex flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row mx-2 sm:mx-0'}>
          <div className="flex md:hidden sm:visible justify-between items-center">
            <p className={'mt-1 sm:mt-0 text-lg sm:text-2xl font-bold text-color22262A'}> {product?.title}</p>
            <p className={'mt-1 sm:mt-3 sm:mb-3 text-base sm:text-2xl color333333'}>{cart.price > -1 ? '$' + cart.price : '$' + product.price}</p>
          </div>
          <PhotoSlider data={product?.images} colorPicked={cart?.itemsPicked['color']?.id}></PhotoSlider>
          <div className={'lg:w-1/12'}></div>
          <div className={'lg:w-8/12'}>
            <div className="flex invisible md:visible justify-between items-center">
              <p className={'mt-1 sm:mt-0 text-lg sm:text-2xl font-bold text-color22262A'}> {product?.title}</p>
              <p className={'mt-1 sm:mt-3 sm:mb-3 text-base sm:text-2xl color333333'}>{cart.price > -1 ? '$' + cart.price : '$' + product.price}</p>
            </div>
            <div className={'h-0.5 bg-ebGray'}></div>
            <ProductOptions options={product.options}></ProductOptions>

            <div className={'my-2.5 '}>
              <div className={'py-2 text-sm sm:text-lg font-bold color262626'}>Select quantity</div>
              <CounterPicker className={'w-28'} onCount={onQuantityPressed}></CounterPicker>
            </div>
            <div className={'sm:inline-flex flex-col justify-end sm:my-2.5 w-full flex-end'}>
              <PaymentButton onClick={() => onClickAddToCart()} isButtonClicked={isButtonClicked} isActive={cart.isAvailable} title={cart.isAvailable ? 'Add to cart' : 'UNAVAILABLE'} leftDrawable={<ShoppingCart color={cart.isAvailable ? '#000' : '#000'} />} titleClassName={!cart.isAvailable ? '' : ''} backgroundClassName={`flex bg-white border  border-primary hover:border-gray-500  py-1.5 sm:py-4 px-4 w-full`}></PaymentButton>
              {cart.isAvailable && (
                <button
                  onClick={() => onClickBuyNow(product)}
                  className={`
                  flex border-1 max-h-12 bg-black rounded-md items-center justify-center cursor-pointer border border-primary hover:border-gray-500  py-1.5 sm:py-4 px-4 w-full
                    mt-3 font-semibold text-white shadow-md
                  `}>
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={'p-0 sm:p-5 pt-2 pb-2 mt-5 sm:mt-10 bg-faGray'}>
          <div className={'px-2 sm:px-0 sm:mx-0 mb-4 w-full'}>
            <div className=" flex">
              <p
                onClick={() => {
                  setTab({ ...tab, isActive: false, position: 1 })
                }}
                className={`transition duration-700 text-base sm:text-lg px-1 sm:px-0 sm:text-xl cursor-pointer border-b-4 hover:border-primary border-transparent text-gray-light  hover:text-primary  pb-1  ${tab.position == 1 ? 'border-primary text-primary' : 'border-transparent'}`}>
                PRODUCT INFORMATION
              </p>
              {product?.sizing_chart?.length != 0 && (
                <p onClick={onClickSizingChart} className={`transition mx-5 duration-700 text-gray-light  sm:text-lg px-1 sm:px-0 sm:text-xl cursor-pointer pb-1  border-b-4 hover:text-primary  hover:border-primary border-transparent ${tab.position == 2 ? 'border-primary text-primary' : 'border-transparent'}`}>
                  VIEW SIZING CHART
                </p>
              )}
            </div>
          </div>
          {tab.isActive ? (
            <SizingChart data={product?.sizing_chart} />
          ) : (
            <div className={'sm:pt-8 mx-2 sm:mx-0 text-sm leading-relaxed text-primary sm:text-s'}>
              <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    ''
  )
})

Product.getLayout = getLayout
export default Product
