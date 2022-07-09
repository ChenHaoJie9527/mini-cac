import { describe, expect, it } from "vitest";
import isWatch from "@/components/isWatch.vue";
import { mount } from "@vue/test-utils";

interface wrapperType {
  count: number;
  state: { count: number };
  age: number;
}
describe("watch make firmly", () => {
  it("make watch", () => {
    const wrapper = mount(isWatch);
    expect((wrapper.vm as wrapperType).count).toBe(1);
    expect((wrapper.vm as wrapperType).state.count).toBe(2);
    expect((wrapper.vm as wrapperType).age).toBe(18);
    // expect()
  });
});
