module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint-config-prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Disable the rule
    '@typescript-eslint/no-unused-vars': 'off'
  },
  root: true,
}
