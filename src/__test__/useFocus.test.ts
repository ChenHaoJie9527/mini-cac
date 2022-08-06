import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import useFocus from '@/components/useFocus.vue';
describe('should useFocus', () => {
  it('test v-focus', async () => {
    const wrapper = mount(useFocus, {
      attachTo: document.body, // 指定挂载到 body 身上 可以是有效的 CSS 选择器，也可以是连接到文档的元素
    });
    // 判断当前元素处于失活状态
    expect(wrapper.find('input').element).not.toBe(document.activeElement);
    await delay(3000);
    expect(wrapper.find('input').element).toBe(document.activeElement);
  });
});

function delay(timer: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timer);
  });
}
