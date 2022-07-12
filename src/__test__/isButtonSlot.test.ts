import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ButtonSlot from '@/components/ButtonSlot.vue';
describe('ButtonSlot test', () => {
  it('test buttonSlot is slot', () => {
    const Button = mount(ButtonSlot, {
      slots: {
        default: 'hello Vitest!',
      },
    });
    expect(Button.text()).toBe('hello Vitest!');
  });
});
