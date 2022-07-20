import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import isPropsValidator from '@/components/isPropsValidator.vue';
import Button from '@/components/Botton.vue';
describe('should props', () => {
  it('test props', () => {
    const fatherWrapper = mount(isPropsValidator);
    const child = fatherWrapper.findComponent(Button);
    expect(child.exists()).toBeTruthy();
    expect(child.vm.type).toBe('text');
  });
});
