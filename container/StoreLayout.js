import LoadingSpinner from '@components/spinner/LoadingSpinner'
import ZohoDeskSupport from '@components/widget/ZohoDeskSupport'
import Navbar from '@container/Navbar'
import { useSelector } from 'react-redux'

const StoreLayout = ({ children, isVisible }) => {
  return (
    <div className={`h-full font-inter ${!isVisible ? 'h-100-vh flex justify-center items-center' : ''}`}>
      <Navbar isVisible={isVisible} />
      {isVisible && <div>{children}</div>}
      {!isVisible && <LoadingSpinner className="my-auto" width="20" height="20" color="black" />}
      {/*<Footer/>*/}
    </div>
  )
}

export const getLayout = (page) => {
  const storeName = useSelector((state) => state.store.store_slug)
  const isLoading = useSelector((state) => state.store.isLoading)

  return (
    <>
      <StoreLayout isVisible={!isLoading}>{page}</StoreLayout>
      {storeName && <ZohoDeskSupport storeName={storeName} />}
    </>
  )
}

export default StoreLayout
