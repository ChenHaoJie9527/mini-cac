import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import isClickStop from "@/components/isClickStop.vue";
describe('should click.stop', () => {
  it('stake click.stop', async () => {
    const list: string[] = [];
    console.log = vi.fn((val: string) => {
      list.push(val);
    });
    const wrapper = mount(isClickStop);
    // findAll：查找所有的div元素
    await wrapper.findAll('div')[1].trigger('click');
    expect(list.length).toBe(1);
  })
})