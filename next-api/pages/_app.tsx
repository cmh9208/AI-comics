import Footer from '@/components/common/Footer'
import Layout from '@/components/common/Layout'
import Nav from '@/components/common/Nav'
import { wrapper } from '@/modules/store'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'


function App({  Component, pageProps: {...pageProps} }: AppProps) {
  return (
    <>
      <Layout>
          <Component {...pageProps} />
      </Layout> 
      <Footer/>
    </>
  )
}

export default wrapper.withRedux(App) 
// export default App