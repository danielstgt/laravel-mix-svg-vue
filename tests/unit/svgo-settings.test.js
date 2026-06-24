const { optimize } = require('svgo');
const SvgVue = require('../../index.js');

// A source SVG that exercises every default svgoSetting at once:
//   - <title>          -> stripped   (removeTitle: true)
//   - width / height   -> stripped   (removeDimensions: true)
//   - viewBox          -> preserved  (removeViewBox: false)
const SOURCE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
    '<title>avatar</title><path d="M12 2L2 7"/></svg>';

// Build the exact svgo plugin list index.js hands to svgo-loader, then run it
// through svgo the same way svgo-loader v3 does: optimize(source, { plugins }).
// This drives the real defaults + _convertSvgoOptions + extendDefaultPlugins,
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
    });

    describe('_convertSvgoOptions', () => {
        it('maps { name: value } entries to svgo v2 { name, active } descriptors', () => {
            const converted = new SvgVue()._convertSvgoOptions([
                { removeTitle: true },
                { removeViewBox: false },
                { removeDimensions: true },
            ]);

            expect(converted).toEqual([
                { name: 'removeTitle', active: true },
                { name: 'removeViewBox', active: false },
                { name: 'removeDimensions', active: true },
            ]);
        });
    });
});
