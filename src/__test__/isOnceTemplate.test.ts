import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import isOnceTemplate from '@/components/isOnceTemplate.vue';
describe('should v-once', () => {
  it('test v-once', async () => {
    const wrapper = mount(isOnceTemplate);
    const spanEl = wrapper.find('span');
    expect(spanEl.exists()).toBeTruthy();
    await delay(1100);
    console.log('spanEl.text()', spanEl.text());
    expect(spanEl.text()).toBe('0');
  });
});
function delay(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
``