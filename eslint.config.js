import { configs } from '@rightcapital/eslint-config';

export default [
  {
    ignores: ['dist/**', 'scripts/**'],
  },
  ...configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      // Existing interactive elements need aria-label additions (tracked for future fix)
      'jsx-a11y/control-has-associated-label': 'warn',
    },
  },
];
