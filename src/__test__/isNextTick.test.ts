import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import nextTick from '@/components/nextTick.vue';
describe('should nextTick', () => {
  it('work nextTick', async () => {
    let printLog = '';
    console.log = vi.fn((log: string) => {
      printLog = log?.toString()?.trim();
    });
    const wrapper = mount(nextTick);
    const divEl = wrapper.find('div');
    expect(divEl.text()).toMatchInlineSnapshot("\"0\"");
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(divEl.text()).toMatchInlineSnapshot("\"1\"");
    expect(printLog).toMatchInlineSnapshot("\"true\"");
  });
});
