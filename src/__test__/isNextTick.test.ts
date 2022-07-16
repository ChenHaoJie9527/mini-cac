import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import nextTick from '@/components/nextTick.vue';
describe('should nextTick', () => {
  it('work nextTick', async () => {
    let printLog = '';
    /**
     * vi.fn  为函数创建一个监听，当每次调用函数时，会存储其调用参数 返回值 实例。
     * console.log 该函数被vi.fn创建的监听函数赋值 当出现console.log被调用时 就会触发fn的回调函数
     */
    console.log = vi.fn((log: string) => {
      printLog = log?.toString()?.trim();
    });
    const wrapper = mount(nextTick);
    const divEl = wrapper.find('div');
    expect(divEl.text()).toMatchInlineSnapshot('"0"');
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(divEl.text()).toMatchInlineSnapshot('"1"');
    expect(printLog).toMatchInlineSnapshot('"true"');
  });
});

describe('should fn', () => {
  it('work fn', () => {
    let text = 0;
    console.log = vi.fn((value: number) => {
      text = value + 1;
    });
    console.log(1);
    expect(text).toBe(2);
  });
});
