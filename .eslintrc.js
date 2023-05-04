module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    settings: {
        'import/extensions': ['.js', '.ts'],
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
    rules: {
        'no-console': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                ts: 'never',
            },
        ],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: false,
                optionalDependencies: false,
                peerDependencies: false,
            },
        ],
    },
};
