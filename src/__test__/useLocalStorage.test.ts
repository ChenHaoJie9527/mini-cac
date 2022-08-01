import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import useLocalStoragesApp from "@/components/useLocalStorage.vue";
describe('should useLocalStorages', () => {
  it('test useLocalStorages', async () => {
    let wrapper = mount(useLocalStoragesApp);
    const p = wrapper.find('p');
    const btn = wrapper.find('button');
    expect(p.text()).toBe('Counter: 0');
    await btn.trigger('click');
    expect(p.text()).toBe('Counter: 1');

    // 卸载组件
    wrapper.unmount();

    // 重新挂载组件
    wrapper = mount(useLocalStoragesApp);
    expect(wrapper.find('p').text()).toBe('Counter: 1')
  })
})
