import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FunctionComponent from '@/components/h.vue';
describe('should function h()', () => {
  it("renders a 'MyButton'", () => {
    const wrapper = mount(FunctionComponent);
    // 包裹器的根 DOM 节点下的标签名，即判断当前组件中是否存在 button 标签名
    expect(wrapper.element.tagName.toLocaleLowerCase()).toBe('button');
  });

  it('test props disabled', async () => {
    const wrapper = mount(FunctionComponent, {
      props: {
        disabled: true,
      },
    });
    // attributes：返回 Wrapper DOM 节点的特性对象
    expect(wrapper.find('button').attributes()).toBeDefined();

    await wrapper.trigger('click');
    // emitted：返回一个包含由 Wrapper vm 触发的自定义事件的对象
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('slot', () => {
    const wrapper = mount(FunctionComponent, {
      slots: {
        default: 'MyButton',
      },
    });
    expect(wrapper.text()).toBe('MyButton');
  });

  it('custom click defined', () => {
    const wrapper = mount(FunctionComponent);
    wrapper.trigger('click');
    expect(
      wrapper.emitted().customClick || wrapper.emitted()['custom-click']
    ).toBe(undefined);
  })
});
