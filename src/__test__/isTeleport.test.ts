import { describe, expect, it } from "vitest";
import TeleportComponent from "@/components/isTeleport.vue";
import { mount } from "@vue/test-utils";
describe('should teleport', () => {
  it('test teleport', () => {
    const wrapper = mount(TeleportComponent);
    // 断言 wrapper 没有 span标签 是因为已经被传送到body 里了
    expect(wrapper.findComponent('span').exists()).toBe(false);
    expect(document.querySelector('body')?.innerHTML).toMatchInlineSnapshot('"<span>hello vue</span>"')
  })
})