module.exports = {
    extends: [
        'next/core-web-vitals',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
};
