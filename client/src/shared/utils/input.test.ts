import { describe, it, expect } from 'vitest';
import { iconLabel } from './input';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { AppIcon } from '../ui';

describe('iconLabel', () => {
    it('renders icon and label correctly', () => {
        const wrapper = mount(
            defineComponent({
                render() {
                    return iconLabel('check', 'Готово');
                },
            }),
            {
                global: {
                    components: { AppIcon },
                },
            },
        );

        expect(wrapper.findComponent(AppIcon).exists()).toBe(true);
        expect(wrapper.text()).toContain('Готово');

        const icon = wrapper.findComponent(AppIcon);
        expect(icon.props('name')).toBe('check');
        expect(icon.props('size')).toBe('1.125rem');
    });
});
