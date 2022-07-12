import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import isShallowRef from '@/components/isShallowRef.vue';
describe('work shallowRef', () => {
  it('test shallowRef', () => {
    // vi: 提供工具函数
    // spyOn 监听对象的方法
    const spy = vi.spyOn(console, 'log'); // 返回一个监听函数
    // 先判断该监听函数没有被调用过
    expect(spy).not.toHaveBeenCalled();
    // 挂载组件
    mount(isShallowRef);
    // toHaveBeenCalled： 此断言用于测试一个函数是否被调用过
    expect(spy).toHaveBeenCalled();
  });
});

/**
 * 上述测试用例用了 vi spyOn toHaveBeenCalled 等API，我们来仔细看一下
 */

describe('work vi', () => {
  it('test vi', () => {
    // vi 是Vitest工具集，提供了许多的工具函数使用
    // 以 vi.fn为例，为函数创建一个监听，但也可以在没有监听的情况下启动。每次调用函数时，存储其调用参数、返回值和实例。
    const fn = vi.fn((val: number) => 1 + val);
    fn(1); // 监听函数被调用
    expect(fn).toHaveBeenCalled(); // 检测函数是否被调用`
    expect(fn).toHaveReturnedWith(2); // 检查一个函数是否至少一次成功返回了指定的值
  });
});

/**
 * spyOn: 是vi提供的工具函数，用于监听对象里的方法是否被调用，并返回一个监听函数。即在对象的方法或 getter/setter 上创建一个监听
 */
describe('work spyOn', () => {
  it('test spyOn', () => {
    const initial = {
      getApples() {
        return 13;
      },
    };
    const spy = vi.spyOn(initial, 'getApples');
    const val = initial.getApples();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturnedWith(val);
  });
});
