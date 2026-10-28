'use client'

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'lab-banner-dismissed'
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return sessionStorage.getItem(STORAGE_KEY) !== '1'
}

// Hidden on the server and during hydration, so a dismissed banner never flashes.
function getServerSnapshot() {
  return false
}

export function useLabBanner() {
  const isVisible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, '1')
    listeners.forEach((listener) => listener())
  }

  return { isVisible, dismiss }
}
