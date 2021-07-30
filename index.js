let mix = require('laravel-mix');
let path = require('path');

class SvgVue {

    name() {
        return 'svgVue';
    }

    dependencies() {
        return ['svgo-loader', 'raw-loader', 'fs', 'svg-vue', 'svg-vue3'];
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
                    loader: 'raw-loader'
                },

                {
                    loader: 'svgo-loader',
                    options: {
                        plugins: this._convertSvgoOptions(this.options.svgoSettings)
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

    _convertSvgoOptions(options) {
        let converted = [];

        options.forEach(option => {
            let settings = Object.keys(option);

            settings.forEach(setting => {
                converted.push({
                    name: setting,
                    active: !! option
                });
            });
        });

        return converted;
    }

}

mix.extend('svgVue', new SvgVue());
