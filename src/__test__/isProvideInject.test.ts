// import { describe, expect, it } from 'vitest';
// import isProvideInject from '@/components/isProvideInject.vue';
// import { mount } from '@vue/test-utils';
// describe('workspace provide to inject', () => {
//   it('should provide to inject', () => {
//     const wrapper = mount(isProvideInject);
//     expect(wrapper.vm.$el.textContent).toBe('1')
//   });
// });
import { mount } from '@vue/test-utils';
import isProvideInject from '@/components/isProvideInject.vue';
import ChildComponent from '@/components/Child.vue';
import { describe, expect, it } from 'vitest';

interface InjectType {
  count: number;
  timer: number;
}
describe('Lifecycle', () => {
  it('The timer will work abnormally when the child component is toggled', async () => {
    const fatherWrapper = mount(isProvideInject);
    const child = fatherWrapper.findComponent(ChildComponent);
    const btn = fatherWrapper.find('button');
    // exists: 断言 Wrapper 或 WrapperArray 是否存在
    // toBeTruthy: 会将检查值转换为布尔值，断言该值是否为 true 。该方法在当你不关心检查值的内容，而只想知道它是否可以转换为 true 时很有用。
    expect(child.exists()).toBeTruthy(); // 断言child是存在

    await delay(1000);
    const firstChildCountData = (child.vm as InjectType).count;
    // toThrowErrorMatchingSnapshot: 获取快照值 如果是Error 将抛出错误信息
    expect(firstChildCountData).toMatchInlineSnapshot('1');

    await btn.trigger('click'); // 触发点击事件
    expect(child.exists()).toBeTruthy(); // 断言 child 不存在

    await delay(1000);
    const secondChildCount = (child.vm as InjectType).count;
    expect(secondChildCount).toMatchInlineSnapshot('1');

    await btn.trigger('click');
    // 断言child组件存在
    expect(fatherWrapper.findComponent(ChildComponent).exists()).toBeTruthy();

    await delay(1000);
    const thirdChildCount = (child.vm as InjectType).count;
    expect(thirdChildCount).toMatchInlineSnapshot('2');

    await delay(1000);
    const fourthChildCount = (child.vm as InjectType).count;
    expect(fourthChildCount).toMatchInlineSnapshot('3');
  });
});

function delay(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
