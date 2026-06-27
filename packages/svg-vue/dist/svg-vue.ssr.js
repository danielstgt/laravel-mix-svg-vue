'use strict';Object.defineProperty(exports,'__esModule',{value:true});// Plain render-function component (no `.vue` SFC) so the build needs no Vue SFC
// compiler. This mirrors exactly what the previous template
//   <svg v-bind="svgAttributes" v-html="svgContent"></svg>
// compiled to: `v-bind="object"` routes `class`/`style` onto the vnode data and
// every other key onto `attrs` (Vue's bindObjectProps), and `v-html` maps to
// `domProps.innerHTML` (null coerced to '', like the `_s` toString helper).
var component = {
    props: {
        icon: String
    },

    computed: {
        iconPath: {
            cache: false,

            get: function get() {
                return this.icon.replace(new RegExp('.'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), '/') + '.svg';
            }
        },

        svgString: function svgString() {
            // A missing icon makes the dynamic webpack `require` throw a terse
            // "Cannot find module" error that crashes the render. Catch it and log a
            // clear, actionable message instead, then render nothing. This is
            // intentionally non-fatal so a single mistyped icon name cannot break the
            // whole app (see danielstgt/svg-vue#2).
            try {
                return require('svg-files-path/' + this.iconPath).default;
            } catch (e) {
                console.error(
                    '[svg-vue] Icon "' + this.icon + '" could not be found (looked for "' + this.iconPath + '"). ' +
                    'Make sure the file exists in your SVG path and note that the icon name must not include the ".svg" extension.'
                );

                return null;
            }
        },

        svgAttributes: function svgAttributes() {
            if (!this.svgString) return {};

            // Parse the attributes of the opening `<svg ...>` tag straight from the
            // string instead of round-tripping through `document.createElement`, so
            // this also works during SSR where there is no `document` (see
            // danielstgt/svg-vue#2). Server and client see the same string, so the
            // rendered markup is identical and hydration stays mismatch-free.
            var openTag = this.svgString.match(/<svg\b([\s\S]*?)>/i);
            if (!openTag) return {};

            var attributes = {};
            var attrRegex = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
            var match;

            while ((match = attrRegex.exec(openTag[1])) !== null) {
                attributes[match[1]] = match[2] !== undefined ? match[2] : (match[3] !== undefined ? match[3] : '');
            }

            return attributes;
        },

        svgContent: function svgContent() {
            return this.svgString ? this.svgString.replace(/^<svg[^>]*>|<\/svg>$/g, '') : null;
        }
    },

    render: function render(h) {
        var data = {
            attrs: {},
            domProps: { innerHTML: this.svgContent == null ? '' : this.svgContent }
        };

        var source = this.svgAttributes;

        Object.keys(source).forEach(function (key) {
            if (key === 'class' || key === 'style') {
                data[key] = source[key];
            } else {
                data.attrs[key] = source[key];
            }
        });

        return h('svg', data);
    }
};function install(Vue) {
    if (install.installed) return;
    install.installed = true;
    Vue.component('SvgVue', component);
}

var plugin = {
    install: install,
};

var GlobalVue = null;

if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}

if (GlobalVue) {
    GlobalVue.use(plugin);
}

component.install = install;exports["default"]=component;