// Jest transformer that mimics the webpack `raw-loader` output used in production:
// the SVG file content is exposed as the module's `default` export, exactly like
// `require('svg-files-path/icon.svg').default` resolves at runtime.
module.exports = {
    process(sourceText) {
        return { code: `module.exports = { default: ${JSON.stringify(sourceText)} };` };
    },
    getCacheKey(sourceText) {
        return sourceText;
    },
};
