import component from './svg-vue.js';

function install(Vue) {
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

component.install = install;

export default component;
