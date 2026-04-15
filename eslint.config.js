// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // TSX props formatting:
      // - up to 2 props can stay on one line
      // - 3+ props must be broken to one prop per line
      'react/jsx-max-props-per-line': [
        'warn',
        {
          maximum: {
            single: 2,
            multi: 1
          }
        }
      ],
      'react/jsx-first-prop-new-line': ['warn', 'multiline-multiprop'],

      // Object formatting:
      // - 3+ keys should be multiline
      // - multiline objects keep one key per line
      // - imports with 4+ named specifiers must be multiline
      'object-curly-newline': [
        'warn',
        {
          ObjectExpression: {
            minProperties: 3,
            multiline: true,
            consistent: true
          },
          ObjectPattern: {
            minProperties: 3,
            multiline: true,
            consistent: true
          },
          ImportDeclaration: {
            minProperties: 4,
            multiline: true,
            consistent: true
          },
          ExportDeclaration: {
            minProperties: 3,
            multiline: true,
            consistent: true
          },
        },
      ],
      // Enforce one key/value per line in object literals (no inline multi-property objects).
      'object-property-newline': ['warn', { allowAllPropertiesOnSameLine: false }],

      // Array formatting:
      // - 3+ values should be multiline
      // - multiline arrays keep one value per line
      'array-bracket-newline': [
        'warn',
        {
          multiline: true,
          minItems: 3,
        },
      ],
      'array-element-newline': [
        'warn',
        {
          ArrayExpression: {
            multiline: true,
            minItems: 3
          },
          ArrayPattern: {
            multiline: true,
            minItems: 3
          },
        },
      ],

      // NOTE:
      // Function-internal empty line preferences are intentionally documented,
      // but not hard-enforced here to avoid noisy lint failures across existing files.
      'lines-between-class-members': [
        'warn',
        'always',
        { exceptAfterSingleLine: true }
      ],
    },
  },
]);
