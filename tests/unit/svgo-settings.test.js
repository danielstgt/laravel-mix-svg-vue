const { optimize } = require('svgo');
const SvgVue = require('../../index.js');

// A source SVG that exercises every default svgoSetting at once:
//   - <title>          -> stripped   (removeTitle: true)
//   - width / height   -> stripped   (removeDimensions: true)
//   - viewBox          -> preserved  (removeViewBox: false)
const SOURCE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
    '<title>avatar</title><path d="M12 2L2 7" fill="#000"/></svg>';

// Build the exact svgo plugin list index.js hands to svgo-loader, then run it
// through svgo the same way svgo-loader v3 does: optimize(source, { plugins }).
// This drives the real defaults + _buildSvgoPlugins (preset-default + overrides),
// not a copy of them.
function optimizeWith(options) {
    const extension = new SvgVue();
    extension.register(options || {});
    const { plugins } = extension.webpackRules().rules[1].options;

    return optimize(SOURCE_SVG, { plugins }).data;
}

describe('SVGO settings (index.js)', () => {
    describe('default svgoSettings', () => {
        it('strips <title> (removeTitle: true)', () => {
            expect(optimizeWith()).not.toContain('<title>');
        });

        it('strips width/height (removeDimensions: true)', () => {
            const out = optimizeWith();

            expect(out).not.toMatch(/\swidth=/);
            expect(out).not.toMatch(/\sheight=/);
        });

        it('keeps the viewBox (removeViewBox: false)', () => {
            expect(optimizeWith()).toContain('viewBox="0 0 24 24"');
        });
    });

    describe('custom svgoSettings override the defaults', () => {
        it('keeps <title> when removeTitle is disabled', () => {
            const out = optimizeWith({ svgoSettings: [{ removeTitle: false }] });

            expect(out).toContain('<title>avatar</title>');
        });

        it('drops the viewBox when removeViewBox is enabled', () => {
            const out = optimizeWith({ svgoSettings: [{ removeViewBox: true }] });

            expect(out).not.toContain('viewBox');
        });

        it('forwards params to an appended plugin (removeAttrs)', () => {
            const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

            const out = optimizeWith({
                svgoSettings: [
                    { removeTitle: true },
                    { removeViewBox: false },
                    { removeDimensions: true },
                    { removeAttrs: { attrs: 'fill' } },
                ],
            });

            // The fill attributes are actually stripped (plugin received its params)...
            expect(out).not.toMatch(/\sfill=/);
            // ...and svgo does not warn about a missing "attrs" parameter.
            expect(warn).not.toHaveBeenCalled();

            warn.mockRestore();
        });
    });

    describe('_buildSvgoPlugins', () => {
        it('maps the default settings to a preset-default config (no deprecated extendDefaultPlugins)', () => {
            const plugins = new SvgVue()._buildSvgoPlugins([
                { removeTitle: true },
                { removeViewBox: false },
                { removeDimensions: true },
            ]);

            expect(plugins).toEqual([
                // removeTitle stays at its preset-default value (enabled), so it
                // produces no override; removeViewBox is disabled via overrides;
                // removeDimensions is not part of preset-default, so it is appended.
                { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
                'removeDimensions',
            ]);
        });

        it('forwards an object value as the params of an appended plugin', () => {
            const plugins = new SvgVue()._buildSvgoPlugins([
                { removeDimensions: true },
                { removeAttrs: { attrs: 'fill' } },
            ]);

            expect(plugins).toEqual([
                { name: 'preset-default', params: { overrides: {} } },
                // removeDimensions needs no config, so it stays a bare string;
                // removeAttrs carries its params instead of being dropped.
                'removeDimensions',
                { name: 'removeAttrs', params: { attrs: 'fill' } },
            ]);
        });

        it('does not emit the deprecated extendDefaultPlugins warning', () => {
            const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

            optimizeWith();

            expect(warn).not.toHaveBeenCalled();

            warn.mockRestore();
        });
    });
});
