import { Suspense } from 'react'
import { redirect } from 'next/navigation'

async function Redirect({ url }: { url: string }): Promise<null> {
  redirect(url)
}

// The server answers a 307. In the static export, a redirect thrown while prerendering the page
// shell only redirects once the JS loads; thrown inside Suspense, Next also adds a
// `<meta http-equiv="refresh">` with the basePath, so it works without JS too. The trailing slash
// matches `trailingSlash: true` and saves GitHub Pages' extra 301.
export function PageRedirect({ url }: { url: string }) {
  if (process.env.STATIC_EXPORT !== '1') redirect(url)
  return (
    <Suspense>
      <Redirect url={`${url}/`} />
    </Suspense>
  )
}
