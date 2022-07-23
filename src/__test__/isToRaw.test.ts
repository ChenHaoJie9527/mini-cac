import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import isToRaw from '@/components/ToRaw.vue';
describe('should toRaw API', () => {
  it('take toRaw', () => {
    const res: string[] = [];
    console.log = vi.fn((log: string) => {
      res.push(log);
    });
    mount(isToRaw);
    expect(JSON.stringify(res)).toBe(JSON.stringify([true, false])); // 匹配是否和isToRaw组件console的值一样
  });
});
