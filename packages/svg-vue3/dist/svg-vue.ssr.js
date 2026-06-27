'use strict';var vue=require('vue');function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}var script = {
  name: 'SvgVue',
  props: {
    icon: String
  },
  setup: function setup(props) {
    var iconPath = vue.computed(function () {
      return props.icon.replace(new RegExp('.'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), '/') + '.svg';
    });
    var svgString = vue.computed(function () {
      // A missing icon makes the dynamic webpack `require` throw a terse
      // "Cannot find module" error that crashes the render. Catch it and log a
      // clear, actionable message instead, then render nothing. This is
      // intentionally non-fatal so a single mistyped icon name cannot break the
      // whole app (see danielstgt/svg-vue#2).
      try {
        return require("svg-files-path/".concat(iconPath.value)).default;
      } catch (e) {
        console.error("[svg-vue] Icon \"".concat(props.icon, "\" could not be found (looked for \"").concat(iconPath.value, "\"). ") + "Make sure the file exists in your SVG path and note that the icon name must not include the \".svg\" extension.");
        return null;
      }
    });
    var svgAttributes = vue.computed(function () {
      if (!svgString.value) return {};

      // Parse the attributes of the opening `<svg ...>` tag straight from the
      // string instead of round-tripping through `document.createElement`, so
      // this also works during SSR where there is no `document` (see
      // danielstgt/svg-vue3#2). Server and client see the same string, so the
      // rendered markup is identical and hydration stays mismatch-free.
      var openTag = svgString.value.match(/<svg\b([\s\S]*?)>/i);
      if (!openTag) return {};
      var attributes = {};
      var attrRegex = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
      var match;
      while ((match = attrRegex.exec(openTag[1])) !== null) {
        attributes[match[1]] = match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : '';
      }
      return attributes;
    });
    var svgContent = vue.computed(function () {
      return svgString.value ? svgString.value.replace(/^<svg[^>]*>|<\/svg>$/g, '') : null;
    });
    return {
      svgAttributes: svgAttributes,
      svgContent: svgContent
    };
  }
};var _hoisted_1 = ["innerHTML"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("svg", vue.mergeProps($setup.svgAttributes, {
    innerHTML: $setup.svgContent
  }), null, 16, _hoisted_1);
}script.render = render;// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var component = /*#__PURE__*/(function () {
  // Get component instance
  var installable = script;

  // Attach install function executed by Vue.use()
  installable.install = function (app) {
    app.component('SvgVue', installable);
  };
  return installable;
})();

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default':component});// Attach named exports directly to component. IIFE/CJS will
// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)
Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
    exportName = _ref2[0],
    exported = _ref2[1];
  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;