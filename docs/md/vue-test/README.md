### Vue-test 测试用例文档

#### 1.测试computed计算属性写入

```vue
// 例子
<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ plusOne }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
const count = ref(1);
const plusOne = computed({
  get() {
    return count.value + 1;
  },
  set() {
    return count.value++;
  },
});
plusOne.value++;
</script>
```

测试用例

```ts
import { describe, expect, it } from "vitest";
import IsComputed from "@/components/isComputed.vue";
import { mount } from "@vue/test-utils";
interface wrapperType {
  plusOne: number;
  count: number;
}
describe("isComputed", () => {
  it("Checked the count and plusOwn", () => {
    const wrapper = mount(IsComputed);
    expect((wrapper.vm as wrapperType).count).toBe(2);
    expect((wrapper.vm as wrapperType).plusOne).toBe(3);
  });
});
```

Tips：`wrapper.vm`是通过挂载组件后生成的应用实例，可以访问挂载组件上的所有实例方法和实例属性。针对传递的道具效果进行测试，会比断言prop已通过更强大

