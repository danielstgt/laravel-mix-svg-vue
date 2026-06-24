// Minimal laravel-mix stub for the unit tests. `laravel-mix` is a peerDependency
// and isn't installed in this repo, yet index.js calls `mix.extend(...)` at module
// load time. That side effect is irrelevant to the SVGO logic under test, so a
// no-op `extend` is enough to let `require('../../index.js')` resolve.
module.exports = { extend() {} };
