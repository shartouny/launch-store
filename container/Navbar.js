import DropDownButton from '@components/button/DropDownButton'
import NestedDropDown from '@components/dropDown/NestedDropDown'
import ShoppingCart from '@components/icons/shoppingCart'
import Search from '@components/search/Search'
import { getAutoComplete, openStore, showPageByCategory, showSearchProduct } from '@redux/reducer/products.reducer'
import { changeCheckout, saveStoreConfig } from '@redux/reducer/store.reducer'
import { applyTheme } from '@themes/utils'
import Head from 'next/head'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Navbar = withRouter(({ router: { query, push, pathname }, isVisible }) => {
  const { slug } = query

  const isHomeView = pathname === '/store/[slug]'

  const [search, setSearch] = useState({
    data: '',
    isHint: false
  })

  const dispatch = useDispatch()

  const categories = useSelector((state) => state.products?.slugs[slug]?.categories?.data)

  const categoryId = useSelector((state) => state.products?.slugs[slug]?.categoryId)

  const sortOptions = useSelector((state) => state.products?.sortOptions)

  const autocompleteValues = useSelector((state) => state.products?.slugs[slug]?.searchAutocomplete)

  const type = useSelector((state) => state.products?.slugs[slug]?.type)

  const searchTerm = useSelector((state) => state.products?.slugs[slug]?.searchTerm)

  const cart = useSelector((state) => state?.shopping?.cart?.filter((cart) => cart.storeSlug == slug))

  const sortValue = useSelector((state) => state.products?.slugs[slug]?.sortValue)

  const storeData = useSelector((state) => state.store)

  //item-selection
  const [item, setItem] = useState({
    categoryId: undefined,
    subCategoryId: '',
    name: ''
  })

  useEffect(() => {
    const init = async () => {
      if (slug)
        try {
          const { categoryId, categoryName, storeData } = await dispatch(openStore(slug))
          await dispatch(saveStoreConfig(storeData))
          const { theme } = storeData
          const baseTheme = {
            '--theme-primary': `rgba(${theme.primaryColor.rgb.r}, ${theme.primaryColor.rgb.g}, ${theme.primaryColor.rgb.b}, ${theme.primaryColor.rgb.a})`,
            '--theme-secondary': `rgba(${theme.secondaryColor.rgb.r}, ${theme.secondaryColor.rgb.g}, ${theme.secondaryColor.rgb.b}, ${theme.secondaryColor.rgb.a})`
          }
          applyTheme(baseTheme)
          setItem({ subCategoryId: '', categoryId, name: categoryName })
        } catch (e) {
          e.status == 403 ? push('/403') : push(`${slug}/${e?.status}`)
        }
    }
    init().then().catch()
  }, [dispatch, slug])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      try {
        if (!search.isHint && slug) {
          if (search.data && search.data.length > 0) dispatch(getAutoComplete(slug, search.data))
        }
      } catch (e) {

      }
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [dispatch, search, slug])

  const onSearchText = (txt) => {
    setSearch({ data: txt, isHint: false })
  }

  const shouldShowCartItemsNumber = !!cart?.length

  // On Press on NavBar Category option
  const onItemSelected = async (id, name) => {
    setItem({ categoryId: id, subCategoryId: undefined, name: name })
    try {
      await dispatch(showPageByCategory(slug, id, '', sortValue, name))
      setSearch({ data: '', isHint: true })
      if (!isHomeView) push(`/store/${slug}`)
    } catch (e) { }
  }

  //On Press on NavBar Sub-Category Option
  const onSubItemSelected = async (id = '', name) => {
    try {
      setItem({ ...item, subCategoryId: id, name: name })
      await dispatch(showPageByCategory(slug, id, '', 1, sortValue, name))
      setSearch({ data: '', isHint: true })
      if (!isHomeView) push(`/store/${slug}`)
    } catch (e) { }
  }

  const shoppingCartPressed = () => (pathname == '/store/[slug]/shopping-cart' ? dispatch(changeCheckout(false)) : push(`/store/${slug}/shopping-cart`))

  const onIconPress = () => {
    item.categoryId && !item.subCategoryId ? dispatch(showPageByCategory(slug, item.categoryId, '', sortValue, item.name)) : dispatch(showPageByCategory(item.subCategoryId, '', 1, sortValue, item.name))
    push(`/store/${slug}`)
  }

  const onHintPressed = (item) => {
    try {
      if (pathname != '/store/[slug]') push(`/store/${slug}`)
      dispatch(showPageByCategory(slug, item.categoryId, item.name, 1, item.category_display_name))
      setSearch({ data: '', isHint: true })
    } catch (e) {
      // router.push(`${slug}/404`)
    }
  }

  const onSearchPressed = () => {
    if (search.data != '') {
      dispatch(showSearchProduct(slug, search.data, 1, sortValue))
      setSearch({
        data: '',
        isHint: true
      })
    }
  }

  const onSortItemPressed = (val) => (type == '' ? dispatch(showPageByCategory(slug, categoryId, '', val)) : dispatch(showSearchProduct(slug, searchTerm, 1, val)))

  return isVisible ? (
    <>
      <Head>
        <title>{storeData.store_name}</title>
        <link rel="icon" href={storeData.fav_icon} />
      </Head>
      <div className=" fixed z-10 w-full bg-white shadow-md">
        <div className=" container mx-auto slide-down">
          <div className={`flex justify-between items-center pb-3 pt-3`}>
            {/*MOBILE BURGER}*/}
            {/*<div className="lg:hidden w-10"*/}
            {/*     onClick={onMobileMenuClick}>*/}
            {/*  <Icon selectedIcon={!openMobileMenu ? "MobileMenu" : "Cancel"} color="#000"/>*/}
            {/*</div>*/}
            <img src={!storeData.logo ? '/icons/website-icons/icon-rounded.svg' : storeData.logo} onClick={onIconPress} className="w-16 cursor-pointer" alt="launch-icon" />
            <div className="hidden lg:flex justify-center space-x-10 w-full font-inter">
              {/*<div onClick={onIconPress} className="cursor-pointer">Home</div>*/}
              {/*<div className="cursor-pointer">About us</div>*/}
              {/*<div className="cursor-pointer">Contact</div>*/}
            </div>
            <div onClick={shoppingCartPressed} className={`cursor-pointer self-end flex justify-end pb-6 pr-2  items-center relative`}>
              <ShoppingCart color="black" />
              {shouldShowCartItemsNumber && (
                <span className="flex absolute -top-4 -right-1 justify-center items-center w-5 h-5 bg-red-500 rounded-full">
                  <p className="text-xs font-semibold text-white">{cart?.length}</p>
                </span>
              )}
            </div>
          </div>
        </div>
        {/* MOBILE MENU */}
        {/*<div className={`w-32 bg-white z-50 lg:hidden top-16 ${!openMobileMenu ? `hidden` : `absolute`}`}>*/}
        {/*  <div className="text-center">*/}
        {/*    <div onClick={onIconPress} className="py-2 border cursor-pointer">Home</div>*/}
        {/*    <div className="py-2 border">About us</div>*/}
        {/*    <div className="py-2 border">Contact</div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* <hr
          className={`${isHomeView ? "lg:hidden block  border-1" : "block border-1 lg:border-2"}  border-gray-light`}/> */}

        {isHomeView && (
          <div>
            {/* WEB */}
            <div className="hidden lg:block bg-primary">
              <div className="container flex justify-between items-center mx-auto">
                <div>
                  <NestedDropDown categoryId={categoryId} label="Shop By Category" className="h-12 md:h-14 lg:h-14" options={categories} onParentSelected={onItemSelected} onChildSelected={onSubItemSelected} selectedIcon="Caret" />
                </div>
                <div className="mr-16">
                  <Search categoryId={categoryId} value={search.data} onChangeHandler={onSearchText} onSearchPressed={onSearchPressed} autocompleteValues={autocompleteValues} onHintsChoose={onHintPressed} className="w-96" placeholder="Search product here..." />
                </div>
                <div>
                  <div className="flex">
                    <DropDownButton label="Sort By" options={sortOptions} value={sortValue} onValueSelected={onSortItemPressed} selectedIcon="Sort" />
                  </div>
                </div>
              </div>
            </div>
            <div className=" container block lg:hidden mx-auto">
              <div className="flex justify-between items-center mt-2">
                <div className="w-full">
                  <Search categoryId={categoryId} value={search.data} onChangeHandler={onSearchText} onSearchPressed={onSearchPressed} autocompleteValues={autocompleteValues} onHintsChoose={onHintPressed} className="w-full" inputClassName="border-2 border-primary" placeholder="Search product here..." />
                </div>
                <div>
                  <DropDownButton label="Sort By" options={sortOptions} value={sortValue} onValueSelected={onSortItemPressed} selectedIcon="Sort" />
                </div>
              </div>

              <div className={'pb-2.5 sm:pb-0'}>
                <div className="lg:flex lg:justify-center mt-2 w-full bg-primary rounded-md">
                  <NestedDropDown label="Shop By Category" className="h-12 md:h-10 lg:h-14" options={categories} onParentSelected={onItemSelected} onChildSelected={onSubItemSelected} selectedIcon="Caret" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  ) : null
})

export default Navbar
