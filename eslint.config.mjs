import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
  ...tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended,
  {
    rules: {
      'no-console': isProd ? 'error' : 'off',
      'no-debugger': isProd ? 'error' : 'off',
      eqeqeq: 'error',
      'prefer-const': 'error'
    }
  },
  { ignores: ['config/*', 'dist/*', 'pnpm-lock.yaml'] },
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  eslintConfigPrettier
];
