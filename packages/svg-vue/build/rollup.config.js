import terser from '@rollup/plugin-terser';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

// `svg-files-path/<icon>` is a webpack alias resolved in the consumer's build, and
// the component reads it through a dynamic `require()`. Rollup leaves that call as a
// runtime `require` (a free global), exactly as the previous build did, so webpack
// can resolve it downstream.
const baseConfig = {
    input: 'src/entry.js',
};

const buildFormats = [];

if (!argv.format || argv.format === 'es') {
    buildFormats.push({
        ...baseConfig,
        output: {
            file: 'dist/svg-vue.esm.js',
            format: 'esm',
            exports: 'named',
        },
        plugins: [
            terser({ format: { ecma: 2015 } }),
        ],
    });
}

if (!argv.format || argv.format === 'cjs') {
    buildFormats.push({
        ...baseConfig,
        output: {
            compact: true,
            file: 'dist/svg-vue.ssr.js',
            format: 'cjs',
            name: 'SvgVue',
            exports: 'named',
        },
    });
}

if (!argv.format || argv.format === 'iife') {
    buildFormats.push({
        ...baseConfig,
        output: {
            compact: true,
            file: 'dist/svg-vue.min.js',
            format: 'iife',
            name: 'SvgVue',
            exports: 'named',
        },
        plugins: [
            terser({ format: { ecma: 5 } }),
        ],
    });
}

export default buildFormats;
