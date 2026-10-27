import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

// `npm run build:pages` sets these for the GitHub Pages export; `dev`/`start` stay as they were.
const isStaticExport = process.env.STATIC_EXPORT === '1'
const basePath = process.env.PAGES_BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  ...(isStaticExport && {
    output: 'export',
    basePath,
    assetPrefix: basePath,
    trailingSlash: true,
  }),
}

export default withMDX(config)
