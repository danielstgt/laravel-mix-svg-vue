let mix = require('laravel-mix');
let path = require('path');

// Plugins that ship enabled in SVGO v2's "preset-default". Mirrors the list in
// svgo/plugins/preset-default.js. Used to decide whether a svgoSetting is a
// tweak to the preset (via `overrides`) or a plugin that has to be added on top.
const PRESET_DEFAULT_PLUGINS = new Set([
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'mergeStyles',
    'inlineStyles',
    'minifyStyles',
    'cleanupIDs',
    'removeUselessDefs',
    'cleanupNumericValues',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeViewBox',
    'cleanupEnableBackground',
    'removeHiddenElems',
    'removeEmptyText',
    'convertShapeToPath',
    'convertEllipseToCircle',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'convertPathData',
    'convertTransform',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'mergePaths',
    'removeUnusedNS',
    'sortDefsChildren',
    'removeTitle',
    'removeDesc',
]);

class SvgVue {

    name() {
        return 'svgVue';
    }

    dependencies() {
        return ['svgo-loader', 'raw-loader', 'svg-vue', 'svg-vue3'];
    }

    register(options) {
        this.options = Object.assign({
            svgPath: 'resources/svg',
            extract: false,
            svgoSettings: [
                { removeTitle: true },
                { removeViewBox: false },
                { removeDimensions: true }
            ]
        }, options);

        this.includePath = path.resolve(__dirname, process.cwd() + '/' + this.options.svgPath);
    }

    boot() {
        Mix.listen('configReady', config => {
            config.module.rules.map(r => {
                if (this._isSvgRegExp(r.test) && ! this._isSvgVueRule(r)) {
                    r.exclude = path.resolve(__dirname, process.cwd() + '/' + this.options.svgPath);
                }
            });
        });
    }

    webpackRules() {
        return {
            test: /\.svg$/,
            include: [
                this.includePath
            ],
            rules: [
                {
                    loader: 'raw-loader' // TODO: change loaders
                },

                {
                    loader: 'svgo-loader',
                    options: {
                        plugins: this._buildSvgoPlugins(this.options.svgoSettings)
                    }
                }
            ]
        }
    }

    webpackConfig(webpackConfig) {
        let fs = require('fs');

        fs.mkdir(this.includePath, error => {
            if (error && error.code === 'EEXIST') return null;
        });

        webpackConfig.resolve.alias['svg-files-path'] = this.includePath;

        if (this.options.extract) {
            let svgAssetsObj = {
                test: this.includePath,
                name: '/js/svg',
                chunks: 'all',
                enforce: true
            }

            if (webpackConfig.optimization.hasOwnProperty('splitChunks')) {
                webpackConfig.optimization.splitChunks.cacheGroups['svgAssets'] = svgAssetsObj;
            } else {
                webpackConfig.optimization = {
                    splitChunks: {
                        cacheGroups: {
                            svgAssets: svgAssetsObj
                        }
                    }
                }
            }
        }
    }

    _isSvgRegExp(pattern) {
        let regExCheck = new RegExp(pattern);

        return regExCheck.test('.svg') || regExCheck.test('font.svg');
    }

    _isSvgVueRule(rule) {
        if (rule.hasOwnProperty('include')) {
            return rule.include.includes(this.includePath);
        }

        return false;
    }

    // Translates the user-facing svgoSettings (`[{ pluginName: value }]`) into the
    // SVGO v2 plugin list, replacing the deprecated `extendDefaultPlugins` utility
    // with the recommended "preset-default" + `overrides` configuration. A falsey
    // value disables a default plugin, an object customizes its params, and a plugin
    // that is not part of preset-default is appended so it runs on top of the
    // defaults. For an appended plugin an object value is forwarded as its `params`,
    // so plugins that require configuration (e.g. `removeAttrs`) work as expected.
    _buildSvgoPlugins(options) {
        let overrides = {};
        let extraPlugins = [];

        options.forEach(option => {
            Object.keys(option).forEach(name => {
                let value = option[name];

                if (PRESET_DEFAULT_PLUGINS.has(name)) {
                    if (! value) {
                        overrides[name] = false;
                    } else if (value !== true) {
                        overrides[name] = value;
                    }
                    // value === true: already enabled in preset-default, nothing to do.
                } else if (value) {
                    // value === true: enable the plugin with its own defaults.
                    // Otherwise forward the object as the plugin's params.
                    extraPlugins.push(value === true ? name : { name, params: value });
                }
            });
        });

        return [
            { name: 'preset-default', params: { overrides } },
            ...extraPlugins
        ];
    }

}

mix.extend('svgVue', new SvgVue());

// Exported for the unit tests so the real SVGO pipeline (defaults, option
// conversion, plugin list) is exercised instead of a copy. Consumers require this
// package for its `mix.extend` side effect above and ignore the return value.
module.exports = SvgVue;
