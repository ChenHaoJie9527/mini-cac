import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import isToggleVue from '@/components/isToggle.vue';
describe('should toggled', () => {
  it('test toggled', async () => {
    const wrapper = mount(isToggleVue);
    const p = wrapper.find('p');
    const btn = wrapper.find('button');
    expect(p.text()).toBe('2');
    await btn.trigger('click');
    expect(p.text()).toBe('1');
    await btn.trigger('click');
    expect(p.text()).toBe('2');
  });
});
