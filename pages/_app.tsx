import '../styles/globals.css'
import '../styles/figma-bridge.css'
import '../styles/figma.css'
import '../styles/globals.css'
import '../styles/main.css'
import '../styles/preflight.css'
import '../styles/tailwind.css'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
