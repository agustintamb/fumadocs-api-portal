'use client'
import { useComponents } from 'fumadocs-openapi'

export function Markdown({ md }: { md: string }) {
  const { Markdown: Comp } = useComponents()

  return <Comp md={md} />
}
