/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // typical TypeScript React code, running in browser
      files: ['src/**/*.{ts,tsx}'],
      excludedFiles: ['src/**/*.test.{ts,tsx}'], // exclude test files
      extends: ['@rightcapital/typescript-react'],
      env: { browser: true },
    },
  ],
};
