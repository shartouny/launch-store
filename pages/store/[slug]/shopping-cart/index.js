import CartEmpty from '@components/empty/CartEmpty'
import Icon from '@components/icons/icon'
import Popup from '@components/popup/Popup'
import ShoppingCartItem from '@components/shoppingCart/ShoppingCartItem'
import { getLayout } from '@container/StoreLayout'
import { requestShareCart } from '@redux/action/shopping.action'
import { removeItemFromCart, sharedCart, updateCardCount } from '@redux/reducer/shopping.reducer'
import Link from 'next/link'
import { withRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ShoppingCart = withRouter(({ router: { query, push } }) => {
  const { slug, r } = query

  const dispatch = useDispatch()

  const store = useSelector((state) => state?.store)

  const cartItems = useSelector((state) => state?.shopping?.cart?.filter((cart) => cart.storeSlug === slug))

  const cartSubtotal = cartItems?.reduce((total, cartItem) => Number(cartItem?.cart?.variant[0]?.price) * Number(cartItem?.cart?.quantity) + total, 0).toFixed(2)

  const [popup, setPopup] = useState({
    message: '',
    visible: false,
    duration: 2000,
    onDismiss: () => {
      setPopup({ ...popup, visible: false, message: '' })
    }
  })

  useEffect(() => {
    ;(async () => {
      try {
        await dispatch(sharedCart(r, slug))
      } catch (e) {
        setPopup({
          ...popup,
          visible: true,
          message: 'Cart Link is expired',
          onDismiss: () => {
            setPopup({ ...popup, visible: false, message: '' })
            push(`/store/${slug}/shopping-cart`)
          }
        })
      }
    })()
  }, [dispatch, popup, push, r, setPopup, slug])

  const share = async () => {
    try {
      await requestShareCart(cartItems, slug)
      setPopup({ ...popup, message: 'Cart link copied to clipboard.', visible: true })
    } catch (e) {
      setPopup({ ...popup, message: e.response.data.error, visible: true })
    }
  }

  const updateItem = (id, quantity) => dispatch(updateCardCount({ id, quantity }))

  const onClickDelete = (id) => dispatch(removeItemFromCart(id))

  const onClickCheckout = () => push(`/store/${slug}/checkout`)

  return (
    <div className={`container mx-auto pt-20`}>
      <Popup message={popup.message} visible={popup.visible} duration={popup.duration} onDismiss={popup.onDismiss} />
      {!!cartItems?.length || <CartEmpty slug={slug} color={store.theme?.primaryColor?.hex} />}
      <div className={'flex flex-col lg:flex-row h-full'}>
        <div className={'px-2 sm:px-1'}>
          <div>
            <div className="flex items-center">
              <p className="sm:-mx-0 mt-4 mb-8 text-2xl font-medium text-black">{!cartItems?.length ? '' : 'Shopping Cart'}</p>
              {!!cartItems?.length && (
                <button className="mt-4 mb-8 ml-3 text-2xl font-medium text-black" onClick={share}>
                  <Icon selectedIcon="Share" />
                </button>
              )}
            </div>
            {!!cartItems?.length && (
              <div className="hidden lg:grid grid-cols-7 md:text-sm lg:text-xl font-semibold">
                <p className="font-normal text-primary"></p>
                <p className="col-span-3 font-normal"> Product Name </p>
                <p className="font-normal text-center">Unit Price</p>
                <p className=" font-normal text-center">Qty</p>
                <p className="font-normal text-right">Price</p>
              </div>
            )}

            {!!cartItems?.length &&
              cartItems.map((cartItem, index) => (
                <ShoppingCartItem
                  active={true}
                  key={index}
                  onDeleteClicked={() => onClickDelete(cartItem?.cart?.variant[0]?.id)}
                  onCartChanged={(count) => {
                    updateItem(cartItem?.cart.variant[0].id, count)
                  }}
                  data={cartItem.cart}
                />
              ))}
            {!!cartItems?.length && (
              <div className={'sm:mt-5 ml-auto w-full md:w-1/2 lg:w-1/5'}>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg">Subtotal</p>
                    <p className="font-normal text-md">${Number(cartSubtotal).toFixed(2)}</p>
                  </div>
                  <div className="text-xs">{store.charges_enabled == 'true' ? 'Taxes and shipping calculated at checkout' : 'checkouts are currently not available please contact store owner'}</div>
                </div>
                {cartItems?.length > 0 && (
                  <div className="flex flex-col-reverse md:flex-row justify-end items-center pb-10 mt-5 md:space-x-2">
                    <Link href={`/store/${slug}`} passHref={true}>
                      <button
                        style={{
                          borderColor: store.theme?.primaryColor?.hex,
                          color: store.theme?.primaryColor?.hex
                        }}
                        className="p-2 mt-2 md:mt-0 w-full md:w-1/2 h-10 font-semibold text-black bg-white rounded-md border border-black border-solid shadow-md">
                        Cancel
                      </button>
                    </Link>
                    <button onClick={onClickCheckout} style={{ backgroundColor: store.theme?.primaryColor?.hex }} disabled={store.charges_enabled != 'true'} className={`p-2 w-full md:w-1/2 h-10 font-semibold text-white bg-black rounded-md shadow-md ${store.charges_enabled == 'true' ? '' : 'cursor-not-allowed'}`}>
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

ShoppingCart.getLayout = getLayout
export default ShoppingCart
