import { useEffect } from 'react'
import Home from './pages/Home'

export default function App() {
    useEffect(() => {
          if (window.fbq) {
                  window.fbq('track', 'PageView');
          }
    }, [])

  return <Home />
}
