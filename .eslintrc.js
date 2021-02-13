module.exports = {
  env: {
    browser: true,
    jquery: true,
    jest: true,
  },
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 6, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  ignorePatterns: ['node_modules/', 'Result/'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'linebreak-style': 0,
    'comma-dangle': 0,
    'object-curly-newline': 0,
    'class-methods-use-this': 0,
    'import/extensions': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-shadow': ['error', { allow: ['e'] }],
    'import/no-unresolved': 0,
    'no-new': 0,
    'no-alert': 0,
    'no-non-null-assertion': 0,
    'no-useless-catch': 0,
    '@typescript-eslint/interface-name-prefix': 0,
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['.'],
      },
    },
  },
};
