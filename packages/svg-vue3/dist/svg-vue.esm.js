import { computed, openBlock, createElementBlock, mergeProps } from 'vue';

var script = {
  name: 'SvgVue',
  props: {
    icon: String
  },
  setup(props) {
    const iconPath = computed(() => props.icon.replace(new RegExp('.'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), '/') + '.svg');
    const svgString = computed(() => {
      // A missing icon makes the dynamic webpack `require` throw a terse
      // "Cannot find module" error that crashes the render. Catch it and log a
      // clear, actionable message instead, then render nothing. This is
      // intentionally non-fatal so a single mistyped icon name cannot break the
      // whole app (see danielstgt/svg-vue#2).
      try {
        return require(`svg-files-path/${iconPath.value}`).default;
      } catch (e) {
        console.error(`[svg-vue] Icon "${props.icon}" could not be found (looked for "${iconPath.value}"). ` + `Make sure the file exists in your SVG path and note that the icon name must not include the ".svg" extension.`);
        return null;
      }
    });
    const svgAttributes = computed(() => {
      if (!svgString.value) return {};

      // Parse the attributes of the opening `<svg ...>` tag straight from the
      // string instead of round-tripping through `document.createElement`, so
      // this also works during SSR where there is no `document` (see
      // danielstgt/svg-vue3#2). Server and client see the same string, so the
      // rendered markup is identical and hydration stays mismatch-free.
      const openTag = svgString.value.match(/<svg\b([\s\S]*?)>/i);
      if (!openTag) return {};
      const attributes = {};
      const attrRegex = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
      let match;
      while ((match = attrRegex.exec(openTag[1])) !== null) {
        attributes[match[1]] = match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : '';
      }
      return attributes;
    });
    const svgContent = computed(() => svgString.value ? svgString.value.replace(/^<svg[^>]*>|<\/svg>$/g, '') : null);
    return {
      svgAttributes,
      svgContent
    };
  }
};

const _hoisted_1 = ["innerHTML"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps($setup.svgAttributes, {
    innerHTML: $setup.svgContent
  }), null, 16, _hoisted_1);
}

script.render = render;

// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = script;

  // Attach install function executed by Vue.use()
  installable.install = app => {
    app.component('SvgVue', installable);
  };
  return installable;
})();

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
