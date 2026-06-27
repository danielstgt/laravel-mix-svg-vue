# Changelog

All notable changes to `laravel-mix-svg-vue` are documented here. This project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.5.0 - 2026-06-28

### Dropped Vue 2 support

Vue 2 reached [end of life](https://v2.vuejs.org/eol/) on December 31, 2023.
Starting with this release, `laravel-mix-svg-vue` targets **Vue 3 only**.

**Installation**

This release requires Vue 3 and the `svg-vue3` component:

```sh
# npm
npm install laravel-mix-svg-vue

# pnpm
pnpm add laravel-mix-svg-vue
```

Existing installs that pin `^0.4.x` will not pick `0.5.0` up automatically, so
opt in explicitly when you are ready to move to Vue 3:

```sh
# npm
npm install laravel-mix-svg-vue@^0.5

# pnpm
pnpm add laravel-mix-svg-vue@^0.5
```

See the [README](README.md#installation) for the full setup, including how to
register the Vue 3 component.

**What changed**

- The Vue 2 component (`svg-vue`) is no longer a dependency of this extension.
  Only the Vue 3 component (`svg-vue3`) is installed and wired up.
- The Vue 2 test project and the bundled `svg-vue` workspace package were removed
  from the repository.
- The README now documents the Vue 3 setup only.

**Why this is a new minor and not a patch**

Dropping Vue 2 is a breaking change for Vue 2 users. Releasing it as `0.5.0`
(rather than a `0.4.x` patch) keeps it out of the `^0.4` range, so existing
installs that pin `^0.4.x` will **not** pick it up automatically and stay on a
Vue 2-compatible release.

### Staying on Vue 2

The last release with Vue 2 support is **`laravel-mix-svg-vue@0.4.4`**. It remains
available on npm. To keep using it, pin the `0.4` line:

```sh
# npm
npm install laravel-mix-svg-vue@^0.4

# pnpm
pnpm add laravel-mix-svg-vue@^0.4
```

Register the matching Vue 2 component (`svg-vue`, last published as `0.2.3`):

```js
// e.g. app.js
import Vue from 'vue';
import SvgVue from 'svg-vue';

Vue.use(SvgVue);

const app = new Vue({
    el: '#app'
});
```

Both `laravel-mix-svg-vue@0.4.x` and `svg-vue@0.2.x` remain installable from npm
and from the matching `v0.4.x` Git tags; only future development moves on to
Vue 3.
