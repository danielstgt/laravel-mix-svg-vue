# Laravel Mix SVG Vue

**Extension to inline SVG files with Vue.js and optimize them automatically with SVGO.**

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
    .svgVue();
```

The last step is to import and register the Vue component:

```js
// e.g. app.js
import Vue from 'vue';
import SvgVue from 'svg-vue';

Vue.use(SvgVue);
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

The path to your SVG files relativ to the Laravel Mix config.

#### `extract`

If you wish to extract the SVG's to a seperate file instead of including them in your main `app.js`, you can set this option to `true`. This will create a separate `svg.js` file which then needs to be loaded in your HTML. Make sure to load `app.js` before `svg.js`:

```html
<script src="{{ mix('js/app.js') }}"></script>
<script src="{{ mix('js/svg.js') }}"></script>
```

#### `svgoSettings`

Determines which settings should be passed to SVGO. [See here](https://github.com/svg/svgo#what-it-can-do) for List of available settings.

#### Options overview

Option | Type | Default | Description
---|---|---|---
`svgPath` | String | `resources/svg` | Path to your SVG files
`extract` | Boolean | `false` | Separate the SVG's from your main bundle
`svgoSettings` | Array | <code>[{&nbsp;removeTitle:&nbsp;true&nbsp;}, {&nbsp;removeViewBox:&nbsp;false&nbsp;}, {&nbsp;removeDimensions:&nbsp;true&nbsp;}]</code> | SVGO settings
