import { describe, expect, it } from 'vitest';
import isProvideInject from '@/components/isProvideInject.vue';
import { mount } from '@vue/test-utils';
describe('workspace provide to inject', () => {
  it('should provide to inject', () => {
    const wrapper = mount(isProvideInject);
    expect(wrapper.vm.$el.textContent).toBe('1')
  });
});
