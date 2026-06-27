// Vue 2 and Vue 3 cannot coexist as a single `vue` package, so each version runs
// in its own Jest project. The matching Vue + test-utils builds are installed under
// npm aliases (vue2/vue3, vtu1/vtu2) and remapped to their canonical import names
// per project via moduleNameMapper.

// Resolve the components to the local monorepo packages so changes to svg-vue /
// svg-vue3 are picked up immediately during development. `dependencies` in
// package.json keep the published npm versions (npm rejects a `file:` override of
// a direct dependency, and a `file:` entry there would ship to consumers), so this
// mapping is the publish-safe way to consume the local packages in tests.
const localComponents = {
    '^svg-vue/(.*)$': '<rootDir>/packages/svg-vue/$1',
    '^svg-vue3/(.*)$': '<rootDir>/packages/svg-vue3/$1',
};

// Resolve `require('svg-files-path/<icon>.svg')` (the webpack alias used in
// production) to the local SVG fixtures.
const svgFilesPath = { '^svg-files-path/(.*)$': '<rootDir>/tests/fixtures/svg/$1' };

// Allow the svg-vue / svg-vue3 single file components to be transformed even though
// they live outside this package.
const transformIgnorePatterns = ['/node_modules/(?!(svg-vue|svg-vue3)/)'];

const svgTransform = '<rootDir>/tests/transforms/svg-transform.js';

module.exports = {
    // Print every individual test case (describe/it) instead of a per-file summary.
    verbose: true,
    projects: [
        {
            displayName: 'vue2',
            rootDir: __dirname,
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/tests/vue2/**/*.test.js'],
            moduleFileExtensions: ['js', 'json', 'vue'],
            transform: {
                '^.+\\.vue$': '@vue/vue2-jest',
                '^.+\\.svg$': svgTransform,
                '^.+\\.js$': 'babel-jest',
            },
            transformIgnorePatterns,
            moduleNameMapper: {
                // Absolute paths so the aliased packages resolve even when imported
                // from the component sources in the sibling repos.
                '^vue$': '<rootDir>/node_modules/vue2',
                '^@vue/test-utils$': '<rootDir>/node_modules/vtu1',
                ...localComponents,
                ...svgFilesPath,
            },
        },
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
                // from the component sources in the sibling repos.
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
