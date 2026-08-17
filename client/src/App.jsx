import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Home from './pages/Home'
import ThankYou from './pages/ThankYou'

export default function App() {
    useEffect(() => {
          if (window.fbq) {
                  window.fbq('track', 'PageView');
          }

          // Server-side arrival beacon.
          //
          // Vercel only logs /api/* calls — page views are served by the CDN and are
          // invisible in function logs. Without this there is no way to tell "ads are
          // sending traffic that does not convert" apart from "no traffic is arriving
          // at all", which are opposite problems with opposite fixes.
          //
          // fbclid is the tell: Meta appends it to every ad click, so its presence
          // proves the visit came from a Facebook ad.
          const params = new URLSearchParams(window.location.search);
          fetch('/api/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              path: window.location.pathname,
              referrer: document.referrer || null,
              fbclid: params.get('fbclid') ? true : false,
              utmSource: params.get('utm_source') || null,
              utmCampaign: params.get('utm_campaign') || null,
            }),
            keepalive: true,
          }).catch(() => {});
    }, [])

    const path = window.location.pathname;
    const page = path === '/thank-you' ? <ThankYou /> : <Home />

  return (
    <>
      {page}
      <Analytics />
    </>
  )
}
