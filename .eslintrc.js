// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
    // This option interrupts the configuration hierarchy at this file
    // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
    root: true,

    // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
    // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
    // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: true,
        }
    },

    env: {
        browser: true,
        es2021: true,
        node: true,
        'vue/setup-compiler-macros': true,
    },

    // Rules order is important, please avoid shuffling them
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended',
    ],

    plugins: [
        '@typescript-eslint',
    ],
    settings: {
        'import/resolver': {
            typescript: {
                project: path.resolve(__dirname, './tsconfig.json'),
            },
        },
    },
    globals: {
        ga: 'readonly', // Google Analytics
        process: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
    },

    // add your custom rules here
    rules: {
        'prefer-promise-reject-errors': 'off',

        quotes: ['warn', 'single', { avoidEscape: true }],

        // this rule, if on, would require explicit return type on the `render` function
        '@typescript-eslint/explicit-function-return-type': 'off',

        // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
        // does not work with type definitions
        'no-unused-vars': 'off',
        'vue/multi-word-component-names': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        // allow debugger during development only
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'semi': [2, 'never'],
        'prettier/prettier': 'off'
    },
}
