# Laravel Mix SVG Vue

**Extension to inline SVG files with Vue.js and optimize them automatically with SVGO.**

[![](https://img.shields.io/npm/v/laravel-mix-svg-vue.svg?color=blue)](https://www.npmjs.com/package/laravel-mix-svg-vue)
[![](https://img.shields.io/npm/l/laravel-mix-svg-vue.svg?color=blueviolet)](https://www.npmjs.com/package/laravel-mix-svg-vue)
[![](https://img.shields.io/npm/dm/laravel-mix-svg-vue.svg)](https://npmcharts.com/compare/laravel-mix-svg-vue?minimal=true)
[![](https://img.badgesize.io/https://unpkg.com/laravel-mix-svg-vue/index.js?label=size&colorB=000000)](https://www.npmjs.com/package/laravel-mix-svg-vue)

## Installation

Install the extension:

```sh
npm install laravel-mix-svg-vue
```

Or if you prefer yarn:

```sh
yarn add laravel-mix-svg-vue
```

Next require the extension inside your Laravel Mix config and call `svgVue()` in your pipeline:

```js
// webpack.mix.js
const mix = require('laravel-mix');
require('laravel-mix-svg-vue');

mix.js('resources/js/app.js', 'public/js')
    // .vue() // only necessary if you are using mix v6
    .svgVue();
```

The last step is to import and register the Vue component, either for Vue 2 or 3. Notice the different imports for `SvgVue`:

#### Vue 2

```js
// e.g. app.js
import Vue from 'vue';
import SvgVue from 'svg-vue';

Vue.use(SvgVue);

const app = new Vue({
    el: '#app'
});
```

#### Vue 3

```js
import { createApp } from 'vue';
import SvgVue from 'svg-vue3';

const app = createApp({});

app.use(SvgVue);

app.mount('#app');
```

## Usage

To display your SVG files, all you need to do is pass the filename (and path if placed inside a subdirectory) to the Vue component:

```html
<!-- resources/svg/avatar.svg -->
<svg-vue icon="avatar"></svg-vue>

<!-- resources/svg/fontawesome/check.svg -->
<svg-vue icon="fontawesome/check"></svg-vue>

<!-- you can also use a "dot" notation as path -->
<svg-vue icon="fontawesome.check"></svg-vue>
```

## Options

#### Default options

If nothing is passed to the extension inside your Laravel Mix config, the following options will be used:

```js
{
    svgPath: 'resources/svg',
    extract: false,
    svgoSettings: [
        { removeTitle: true },
        { removeViewBox: false },
        { removeDimensions: true }
    ]
}
```

#### Option details

#### `svgPath`

The path to your SVG files relative to the Laravel Mix config.

#### `extract`

If you wish to extract the SVG's to a separate file instead of including them in your main `app.js`, you can set this option to `true`. This will create a `svg.js` file which then needs to be loaded in your HTML. Make sure to load `app.js` before `svg.js`:

```html
<script src="{{ mix('js/app.js') }}"></script>
<script src="{{ mix('js/svg.js') }}"></script>
```

#### `svgoSettings`

Determines which settings should be passed to SVGO. [See here](https://github.com/svg/svgo#what-it-can-do) for a list of available settings.

#### Options overview

Option | Type | Default | Description
---|---|---|---
`svgPath` | String | `resources/svg` | Path to your SVG files
`extract` | Boolean | `false` | Separate the SVG's from your main bundle
`svgoSettings` | Array | <code>[{&nbsp;removeTitle:&nbsp;true&nbsp;}, {&nbsp;removeViewBox:&nbsp;false&nbsp;}, {&nbsp;removeDimensions:&nbsp;true&nbsp;}]</code> | SVGO settings

## A note for toggling or rendering icons inside lists

Not really related to SVG Vue, but when more than one `<svg-vue>` icon is rendered inside a conditional state with `v-if` or `v-for`, a `key` attribute should be used to tell Vue that an element needs to change when any condition changes.

While in most cases the cost for toggling elements with `v-show` should be preferred (also no need for a `key` attribute then), a simple example when toggling an icon with `v-if` inside a button could look like this:

```html
<button v-if="active" key="active-btn">
    <svg-vue icon="active-icon" class="..."></svg-vue>
    <span>Active</span>
</button>

<button v-if="inactive" key="inactive-btn">
    <svg-vue icon="inactive-icon" class="..."></svg-vue>
    <span>Inactive</span>
</button>
```

Rendering lists could be handled like this:

```html
<ul>
    <li v-for="item in items" :key="item.id">
        <p>{{ item.title }}</p>
        <svg-vue :icon="item.icon" class="..."></svg-vue>
    </li>
</ul>
```

Just remember the `key` has to be unique. More examples for this can be found in the Vue documentation.

When toggling between elements that have the same tag name, you must tell Vue that they are distinct elements by giving them unique key attributes. Otherwise, Vue’s compiler will only replace the content of the element for efficiency. Even when technically unnecessary though, it’s considered good practice to always key multiple items within a component.
