import { DOMWrapper, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import useCounter from '@/components/useCounter.vue';
describe('should useCounter', () => {
  let wrapper,
    incBtn: DOMWrapper<HTMLButtonElement>,
    decBtn: DOMWrapper<HTMLButtonElement>,
    text: DOMWrapper<HTMLParagraphElement>;
  // let text: DOMWrapper<HTMLParagraphElement> | string = '';
  // beforeEach: 注册一个回调,在当前上下文中的每个测试运行之前被调用, 即每个测试前都会调用该回调函数
  beforeEach(() => {
    wrapper = mount(useCounter);
    incBtn = wrapper.findAll('button')[0];
    decBtn = wrapper.findAll('button')[1];
    text = wrapper.find('p');
  });

  // 第一个测试
  it('should work', async () => {
    expect(text.text()).toBe('Count: 0');
    // 点击加法4下
    await triggerClick(incBtn, 4);
    expect(text.text()).toBe('Count: 4');
    // 点击减法2下
    await triggerClick(decBtn, 2)
    expect(text.text()).toBe('Count: 2');
  });

  it('support min and max', async () => {
    expect(text.text()).toBe('Count: 0');
    await triggerClick(incBtn, 15);
    // 测试最大值 由于max: 10, 所以点击15下 还是11
    expect(text.text()).toBe('Count: 11')
    await triggerClick(decBtn, 20);
    // 测试最小值 由于min: 0 所以点击20下 还是0
    expect(text.text()).toBe('Count: 0')
  });
});

async function triggerClick(el: DOMWrapper<HTMLButtonElement>, timer = 1) {
  for (let i = 0; i < timer; i++) {
    await el.trigger('click');
  }
}
