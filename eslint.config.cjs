const js = require('@eslint/js');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactNativePlugin = require('eslint-plugin-react-native');

const reactRules = (reactPlugin.configs.recommended || {}).rules || {};
const reactNativeRules = (reactNativePlugin.configs.recommended || {}).rules || {};
const reactHooksRules = (reactHooksPlugin.configs.recommended || {}).rules || {};

module.exports = [
  { ignores: ['node_modules/**', 'dist/**', 'build/**', 'babel.config.js', 'jest.config.js'] },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactRules,
      ...reactNativeRules,
      ...reactHooksRules,
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
