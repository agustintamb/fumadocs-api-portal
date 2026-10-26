import { describe, expect, it } from 'vitest'
import { normalizeText } from './normalize-text'

describe('normalizeText', () => {
  it('lowercases, trims and strips diacritics', () => {
    expect(normalizeText('  Autenticación ')).toBe('autenticacion')
    expect(normalizeText('CONTENIDO')).toBe('contenido')
  })

  it('returns empty string for blank input', () => {
    expect(normalizeText('   ')).toBe('')
  })
})
