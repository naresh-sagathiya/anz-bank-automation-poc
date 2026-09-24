import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'dist/**',
      'test-results/**',
      'reports/**',
      'cucumber.js',
      'scripts/**/*.js'
    ]
  }
);
