import { mount } from '@vue/test-utils';
import SvgVue from 'svg-vue/src/svg-vue.js';

describe('svg-vue (Vue 2)', () => {
    it('renders the referenced SVG inline as an <svg> element', () => {
        const wrapper = mount(SvgVue, { propsData: { icon: 'avatar' } });

        expect(wrapper.element.tagName.toLowerCase()).toBe('svg');
    });

    it('inlines the inner SVG markup', () => {
        const wrapper = mount(SvgVue, { propsData: { icon: 'avatar' } });

        expect(wrapper.html()).toContain('M12 2L2 7');
    });

    it('applies the attributes from the source SVG to the root element', () => {
        const wrapper = mount(SvgVue, { propsData: { icon: 'avatar' } });

        expect(wrapper.element.getAttribute('fill')).toBe('currentColor');
        expect(wrapper.element.getAttribute('viewBox')).toBe('0 0 24 24');
    });

    it('resolves the dot notation to a nested path', () => {
        const wrapper = mount(SvgVue, { propsData: { icon: 'fontawesome.check' } });

        expect(wrapper.html()).toContain('<circle');
    });

    it('resolves the slash notation to a nested path', () => {
        const wrapper = mount(SvgVue, { propsData: { icon: 'fontawesome/check' } });

        expect(wrapper.html()).toContain('<circle');
    });

    it('logs an error and renders an empty <svg> instead of throwing when the icon is missing', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const wrapper = mount(SvgVue, { propsData: { icon: 'does-not-exist' } });

        expect(wrapper.element.tagName.toLowerCase()).toBe('svg');
        expect(wrapper.element.innerHTML).toBe('');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toContain('does-not-exist');

        spy.mockRestore();
    });

    it('mentions the ".svg" extension pitfall when the icon name includes it', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        mount(SvgVue, { propsData: { icon: 'avatar.svg' } });

        expect(spy.mock.calls[0][0]).toContain('.svg');

        spy.mockRestore();
    });
});
