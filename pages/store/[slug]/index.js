import ProductEmpty from '@components/empty/ProductEmpty'
import TextLoader from '@components/loader/TextLoader'
import Popup from '@components/popup/Popup'
import ProductCard from '@components/product/ProductCard'
import { getLayout } from '@container/StoreLayout'
import { showPageByCategory, showPageOfProduct, showSearchProduct } from '@redux/reducer/products.reducer'
import { addCartList } from '@redux/reducer/shopping.reducer'
import { withRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Home = withRouter(({ router: { query, push } }) => {
  const { slug } = query

  const [shouldShowScrollBtn, setShouldShowScrollBtn] = useState(false)

  const [isLoading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const container = useRef(null)

  const products = useSelector((state) => state.products.slugs[slug]?.products)

  const type = useSelector((state) => state.products.slugs[slug]?.type)

  const categoryName = useSelector((state) => state.products.slugs[slug]?.categoryName)

  const categories = useSelector((state) => state.products.slugs[slug]?.categories?.data)

  const isChangingCategory = useSelector((state) => state.products.slugs[slug]?.isChangingCategory)

  const sortValue = useSelector((state) => state.products.slugs[slug]?.sortValue)

  const searchTerm = useSelector((state) => state.products.slugs[slug]?.searchTerm)

  const [popup, setPopup] = useState({
    message: 'Product not found!',
    visible: false,
    duration: 3000,
    onDismiss: () => {
      setPopup({ ...popup, visible: false, message: '' })
    }
  })

  const [isWaiting] = useState(false)

  const listener = () => {
    if (container?.current?.getBoundingClientRect().bottom <= window.innerHeight) {
      setLoading(true)
    }
    window.pageYOffset > 300 ? setShouldShowScrollBtn(true) : setShouldShowScrollBtn(false)
  }

  useEffect(() => {
    document?.addEventListener('scroll', listener)
    return () => {
      document?.removeEventListener('scroll', listener)
    }
  }, [])

  useEffect(() => {
    if (isLoading)
      if (products?.current_page <= products?.last_page)
        if (!type || type.length == 0)
          dispatch(showPageOfProduct(slug))
            .then(() => {
              document?.addEventListener('scroll', listener)
              setLoading(false)
            })
            .catch(() => {
              setLoading(false)
              // route.push(`/store/${slug}/404`)
            })
        else dispatch(showSearchProduct(slug, searchTerm, products?.current_page + 1, sortValue))
      else {
        setLoading(false)
        document?.removeEventListener('scroll', listener)
      }
    else if (products?.current_page == products?.last_page) document?.removeEventListener('scroll', listener)
    else if (products.current_page < products?.last_page) document?.addEventListener('scroll', listener)
  }, [products, isLoading, type, dispatch, slug, sortValue, searchTerm])

  const onClickProduct = (name, id) => push({ pathname: `${slug}/product/${id}/${name.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '-')}` })

  const addToCart = (product) => dispatch(addCartList(product))

  const onClickClearAll = () => (categories.length == 0 ? dispatch(showPageByCategory(slug, '1', '', 1, '')) : dispatch(showPageByCategory(slug, categories[0].id, '', 1, categoryName)))

  const onScrollTopHandler = () => {
    setShouldShowScrollBtn(false)
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    document.addEventListener('scroll', listener)
  }

  return (
    <div className=" h-screen">
      <div className="container lg:pt-36 mx-auto h-full pt-54">
        <Popup message={popup.message} visible={popup.visible} duration={popup.duration} onDismiss={popup.onDismiss} />
        {/* LOADING AND FADE ANIMATION ON CHANGE CATEGORY */}
        {isChangingCategory && (
          <div className="z-50 mx-auto transform translate-y-5 md:-translate-y-30 fit-content">
            <TextLoader label="Loading products..." />
          </div>
        )}
        {isChangingCategory && <div className="flex absolute top-0 right-0 bottom-0 left-0 z-50 justify-center items-center bg-white opacity-70"></div>}

        <div className="p-2 sm:pt-6 sm:pb-4">
          {/* CATEGORY */}
          {!!products?.data && categoryName?.length > 0 && !isChangingCategory && <p className=" text-xl sm:text-2xl font-semibold text-center">{categoryName}</p>}
          {/* SEARCH RESULT */}
          {!!searchTerm?.length && products?.data?.length != 0 && <p className="text-center">{`Showing results for: ${searchTerm}`}</p>}
        </div>

        {/* PRODUCTS NOT FOUND */}
        {!!isWaiting ? (
          ''
        ) : products?.data?.length == 0 ? (
          <ProductEmpty isNotFound={!!searchTerm} categories={categories} slug={slug} title={searchTerm ? `No matching results found for "${searchTerm}"` : 'No products available'} body={'We can’t find any item matching your search'} onClickClearAll={onClickClearAll} />
        ) : (
          <div ref={container} className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-20 md:gap-20 lg:gap-20 gap-y-3 justify-center pb-24 lg:pb-20">
            {products?.data?.map((product, index) => (
              <ProductCard data={product} key={index} onAddToCartClicked={() => addToCart({ ...product, quantity: 1 })} onProductClicked={() => onClickProduct(product.name, product.platform_product_id)} />
            ))}
            {isLoading && <img alt={'loader.svg'} className="xs:col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5 mx-auto w-20 h-20 animate-spin" src="/icons/loader.svg" />}
          </div>
        )}

        {shouldShowScrollBtn ? (
          <span className="flex md:hidden lg:hidden fixed right-5 bottom-5 z-50 justify-center items-center w-10 h-10 font-semibold text-white bg-secondary rounded-full cursor-pointer" onClick={onScrollTopHandler}>
            <img alt={'arrow-up.svg'} src="/icons/arrow-up.svg" />
          </span>
        ) : null}
      </div>
    </div>
  )
})

Home.getLayout = getLayout
export default Home
