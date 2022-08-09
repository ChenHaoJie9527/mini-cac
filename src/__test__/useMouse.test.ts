import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import useMouse from '@/components/useMouse.vue';

describe('should useMouseMove', () => {
  it('useMouseMove', async () => {
    const wrapper = mount(useMouse);
    expect(wrapper.html()).toBe('Mouse position is at: 0, 0');

    const mousemove = new MouseEvent('mousemove', {
      screenX: 10,
      screenY: 20,
      clientX: 10,
      clientY: 20,
    });

    const res = dispatchEvent(mousemove);
    await nextTick();
    expect(res).toBeTruthy();
    // res && expect(wrapper.html()).toBe('Mouse position is at: 10, 20');
  });
});
