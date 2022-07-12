import { describe, expect, it } from 'vitest';
import IsComputed from '@/components/isComputed.vue';
import { mount } from '@vue/test-utils';
interface wrapperType {
  plusOne: number;
  count: number;
}
describe('isComputed', () => {
  it('Checked the count and plusOwn', () => {
    const wrapper = mount(IsComputed);
    expect((wrapper.vm as wrapperType).count).toBe(2);
    expect((wrapper.vm as wrapperType).plusOne).toBe(3);
  });
});
