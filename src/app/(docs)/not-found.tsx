import { NotFoundContent } from '@/components/NotFoundContent'

// The docs layout already draws the header, so the root 404 (which has its own) would repeat it.
export default function NotFound() {
  return <NotFoundContent />
}
