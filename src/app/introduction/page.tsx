import { PageRedirect } from '@/components/PageRedirect'

// A page instead of a `next.config` redirect, so it also works in the static export.
export default function Page() {
  return <PageRedirect url="/docs/introduction" />
}
