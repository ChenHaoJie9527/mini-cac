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

#### 2. 测试 isRef

例子

```vue
<script setup lang="ts">
import { reactive, toRefs } from "vue";

function useCount() {
  const state = reactive({
    count: 0,
  });

  function update(value: number) {
    state.count = value;
  }

  return {
    state: toRefs(state),
    update,
  };
}

// Ensure the destructured properties don't lose their reactivity
const {
  state: { count },
  update,
} = useCount();
</script>

<template>
  <div>
    <p>
      <span @click="update(count - 1)">-</span>
      {{ count }}
      <span @click="update(count + 1)">+</span>
    </p>
  </div>
</template>
```

测试用例

```tsx
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import type { Ref, ToRefs } from "vue";
import { isRef } from "vue";

import IsRefExamples from "@/components/isRef.vue";
interface LosingReactivityType {
  useCount: () => {
    state: ToRefs<{ count: Ref<number> }>;
    update: (value: number) => void;
  };
}

describe("LosingReactivity", () => {
  it("count is Ref", () => {
    const wrapper = mount(IsRefExamples);
    const {
      state: { count },
    } = (wrapper.vm as unknown as LosingReactivityType).useCount();
    expect(isRef(count)).toBe(true);
  });
});
```

#### 3.测试watch全家桶

例子

```vue
<script setup lang="ts">
import { ref, watch } from "vue";

const count = ref(0);

/**
 * 挑战 1: Watch 一次
 * 确保副作用函数只执行一次
 */
const onceWatch = watch(count, () => {
  console.log("Only triggered once");
  // 手动清除监听器
  onceWatch();
});

count.value = 1;
setTimeout(() => (count.value = 2));
console.log("count.value", count.value);

/**
 * 挑战 2: Watch 对象
 * 确保副作用函数被正确触发
 */
const state = ref({
  count: 0,
});

watch(
  state,
  () => {
    console.log("The state.count updated");
  },
  { deep: true }
);

state.value.count = 2;

/**
 * 挑战 3: 副作用函数刷新时机
 * 确保正确访问到更新后的`eleRef`值
 */

const eleRef = ref();
const age = ref(2);
watch(
  age,
  () => {
    console.log(eleRef.value);
  },
  { flush: "post" }
);
age.value = 18;
</script>

<template>
  <div>
    <p>
      {{ count }}
    </p>
    <p ref="eleRef">
      {{ age }}
    </p>
  </div>
</template>
```

测试用例

```tsx
import { describe, expect, it } from "vitest";
import isWatch from "@/components/isWatch.vue";
import { mount } from "@vue/test-utils";
import { Ref } from "vue";

interface wrapperType {
  count: number;
  state: { count: number };
  age: number;
  eleRef: Ref<any>
}
describe("watch make firmly", () => {
  it("make watch", () => {
    const wrapper = mount(isWatch);
    expect((wrapper.vm as wrapperType).count).toBe(1);
    expect((wrapper.vm as wrapperType).state.count).toBe(2);
    expect((wrapper.vm as wrapperType).age).toBe(18);
    expect((wrapper.vm as wrapperType).eleRef).not.toBe(undefined);
  });
});
```

#### 4.测试shallowRef浅拷贝

例子

```vue
<script setup lang="ts">
import { shallowRef, watch } from "vue";

const state = shallowRef({ count: 1 });

// Does NOT trigger
watch(
  state,
  () => {
    console.log("State.count Updated");
  },
  { deep: true }
);

/**
 * 请注意，虽然在视图上能够看到count已经被修改了，但是并不会触发Wath，这是执行同步代码后，直接先于watch进入	到 effect 去了，导致在视图上看起来已经赋值成功了
 然后如果在异步代码中执行一下的代码，并不会触发视图的更新
 所以要考虑同步和异步的问题
*/
// 不会更新
//Promise.resolve().then(() => {
//	state.value.count = 2; // 不会被触发更改
//});

// 同步代码会更新
// state.value.count = 2
// 由于shallowRef只对value层进行响应代理，不会进行深度deep响应，所以应该采用重新赋值的方式，触发watch
state.value = {
  count: 2,
};
</script>

<template>
  <div>
    <p>
      {{ state.count }}
    </p>
  </div>
</template>
```

测试用例

```tsx
import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import isShallowRef from "@/components/isShallowRef.vue";
describe("work shallowRef", () => {
  it("test shallowRef", () => {
    // vi: 提供工具函数
    // spyOn 监听对象的方法
    const spy = vi.spyOn(console, "log"); // 返回一个监听函数
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

describe("work vi", () => {
  it("test vi", () => {
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
describe("work spyOn", () => {
  it("test spyOn", () => {
    const initial = {
      getApples() {
        return 13;
      },
    };
    const spy = vi.spyOn(initial, "getApples");
    const val = initial.getApples();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturnedWith(val);
  });
});
```

