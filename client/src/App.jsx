import { useEffect } from 'react'
import Home from './pages/Home'
import ThankYou from './pages/ThankYou'

export default function App() {
    useEffect(() => {
          if (window.fbq) {
                  window.fbq('track', 'PageView');
          }
    }, [])

    const path = window.location.pathname;
    const page = path === '/thank-you' ? <ThankYou /> : <Home />

  return page
}
