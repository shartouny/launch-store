import '../styles/globals.scss'
import '../styles/search.css'
import '../styles/countrysearch.css'
import '../styles/site/main.css'
import '../styles/store/sizingChart.css'
import '../styles/store/innerImageZoom.css'

import Head from 'next/head'
import { useStore } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { wrapper } from '../redux/config/store'

function MyApp({ Component, pageProps }) {
  const store = useStore()

  const getLayout = Component.getLayout || ((page) => page)

  return (
    <div>
      <Head>
        <title>Launch Store</title>
        <meta charSet="utf-8" />
        <meta property="author" content="teelaunch" />
        <meta property="keywords" content=""></meta>
        <meta name="title" content=""></meta>
        <meta name="description" content=""></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:url" content="" key="ogurl" />
        <meta property="og:image" content="" key="ogimage" />
        <meta property="og:site_name" content="" key="ogsitename" />
        <meta property="og:title" content="Launch Store" key="ogtitle" />
        <meta property="og:description" content="test description" key="ogdesc" />
      </Head>
      <PersistGate persistor={store.__persistor} loading={<div></div>}>
        {getLayout(<Component {...pageProps} />)}
      </PersistGate>
    </div>
  )
}

export default wrapper.withRedux(MyApp)
