import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import type { Ref, ToRefs } from 'vue';
import { isRef } from 'vue';

import IsRefExamples from '@/components/isRef.vue';
interface LosingReactivityType {
  useCount: () => {
    state: ToRefs<{ count: Ref<number> }>;
    update: (value: number) => void;
  };
}

describe('LosingReactivity', () => {
  it('count is Ref', () => {
    const wrapper = mount(IsRefExamples);
    const {
      state: { count },
    } = (wrapper.vm as unknown as LosingReactivityType).useCount();
    expect(isRef(count)).toBe(true);
  });
});
