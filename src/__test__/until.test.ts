import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import until from '@/components/until.vue';
describe('should until', () => {
  it('test until', async () => {
    const arr: string[] = [];
    console.log = vi.fn(log => {
      arr.push(log);
    });
    const wrapper = mount(until);
    const p = wrapper.find('p');
    expect(p.exists()).toBeTruthy();
    await p.trigger('click');
    /**
     * 之所以delay 4000，是因为在increase函数里 count是从0开始的，所以只有到4s的时候， count才为3
     * 当count 为 3 的时候，console.log(count.value === 3) 才成立
     */
    delay(400);
    expect(JSON.stringify(arr)).toBe('[true]');
  });
});

function delay(timer: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timer);
  });
}
