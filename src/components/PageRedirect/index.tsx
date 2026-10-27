import { Suspense, type ReactNode } from 'react'
import { redirect } from 'next/navigation'

async function Redirect({ url }: { url: string }): Promise<null> {
  redirect(url)
}

export interface PageRedirectProps {
  url: string
  // Shown in the static export until the browser follows the redirect.
  fallback?: ReactNode
}

// The server answers a 307. In the static export, a redirect thrown while prerendering the page
// shell only redirects once the JS loads; thrown inside Suspense, Next also adds a
// `<meta http-equiv="refresh">` with the basePath, so it works without JS too. The trailing slash
// matches `trailingSlash: true` and saves GitHub Pages' extra 301.
export function PageRedirect({ url, fallback }: PageRedirectProps) {
  if (process.env.STATIC_EXPORT !== '1') redirect(url)
  return (
    <>
      {fallback}
      <Suspense>
        <Redirect url={`${url}/`} />
      </Suspense>
    </>
  )
}
