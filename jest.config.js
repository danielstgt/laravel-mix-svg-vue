// The Vue component (svg-vue3) is tested with the matching Vue 3 + test-utils
// builds. They are installed under npm aliases (vue3, vtu2) and remapped to their
// canonical import names via moduleNameMapper so the component sources resolve the
// same way they do for consumers.

// Resolve the component to the local monorepo package so changes to svg-vue3 are
// picked up immediately during development. `dependencies` in package.json keep the
// published npm version (npm rejects a `file:` override of a direct dependency, and
// a `file:` entry there would ship to consumers), so this mapping is the
// publish-safe way to consume the local package in tests.
const localComponents = {
    '^svg-vue3/(.*)$': '<rootDir>/packages/svg-vue3/$1',
};

// Resolve `require('svg-files-path/<icon>.svg')` (the webpack alias used in
// production) to the local SVG fixtures.
const svgFilesPath = { '^svg-files-path/(.*)$': '<rootDir>/tests/fixtures/svg/$1' };

// Allow the svg-vue3 single file component to be transformed even though it lives
// outside this package.
const transformIgnorePatterns = ['/node_modules/(?!svg-vue3/)'];

const svgTransform = '<rootDir>/tests/transforms/svg-transform.js';

module.exports = {
    // Print every individual test case (describe/it) instead of a per-file summary.
    verbose: true,
    projects: [
        {
            displayName: 'vue3',
            rootDir: __dirname,
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/tests/vue3/**/*.test.js'],
            moduleFileExtensions: ['js', 'json', 'vue'],
            transform: {
                '^.+\\.vue$': '@vue/vue3-jest',
                '^.+\\.svg$': svgTransform,
                '^.+\\.js$': 'babel-jest',
            },
            transformIgnorePatterns,
            moduleNameMapper: {
                // Absolute paths so the aliased packages resolve even when imported
                // from the component sources in the sibling package.
                '^vue$': '<rootDir>/node_modules/vue3',
                '^@vue/test-utils$': '<rootDir>/node_modules/vtu2',
                ...localComponents,
                ...svgFilesPath,
            },
        },
        {
            // Framework-agnostic unit tests for index.js (SVGO pipeline). Runs in
            // node — no jsdom/Vue needed. `laravel-mix` (a peerDependency, not
            // installed here) is mapped to a stub so index.js can be required.
            displayName: 'node',
            rootDir: __dirname,
            testEnvironment: 'node',
            testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
            moduleFileExtensions: ['js', 'json'],
            transform: {
                '^.+\\.js$': 'babel-jest',
            },
            moduleNameMapper: {
                '^laravel-mix$': '<rootDir>/tests/mocks/laravel-mix.js',
            },
        },
    ],
};
