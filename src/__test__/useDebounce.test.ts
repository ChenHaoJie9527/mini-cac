import { DOMWrapper, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import useDebounce from '@/components/useDebounce.vue';

async function triggerClick(el: DOMWrapper<HTMLButtonElement>, timer = 1) {
  for (let i = 0; i < timer; i++) {
    await el.trigger('click');
  }
}
describe('should v-debounce', () => {
  it('use-debounce', async () => {
    const res: string[] = [];
    console.log = vi.fn((val: string) => {
      res.push(val);
    });
    const wrapper = mount(useDebounce);
    await triggerClick(wrapper.find('button'), 2);
    expect(JSON.stringify(res)).toBe('["Only triggered once when clicked many times quickly"]');
  });
});
