import { h } from 'vue';
import { AppIcon } from '../ui';

export const iconLabel = (icon: string, label: string) =>
    h('span', { style: 'display: flex; align-items: center; gap: 6px' }, [
        h(AppIcon, { name: icon, size: 18 }),
        h('span', label),
    ]);
