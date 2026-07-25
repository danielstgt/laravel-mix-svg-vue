// The Vue component (svg-vue3) is tested with the matching Vue 3 + test-utils
// builds, installed as plain devDependencies. Only one Vue 3 exists in the tree, so
// `vue` and `@vue/test-utils` resolve the same way they do for consumers and need no
// remapping. `@vue/compiler-sfc` looks unused in package.json but is not: @vue/vue3-jest
// requires it without declaring it, so it has to stay a direct devDependency.

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
                ...localComponents,
                ...svgFilesPath,
            },
        },
        {
            // Framework-agnostic unit tests for index.js (SVGO pipeline). Runs in
            // node — no jsdom/Vue needed. `laravel-mix` is a peerDependency owned by
            // the consumer, so it is mapped to a stub: index.js calls `mix.extend(...)`
            // at load time and that side effect is irrelevant to the SVGO logic here.
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
