import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier/flat'
import prettierPlugin from 'eslint-plugin-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  prettierConfig,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.source/**',
    '.superpowers/**',
    'playwright-report/**',
    'test-results/**',
  ]),
])

export default eslintConfig
