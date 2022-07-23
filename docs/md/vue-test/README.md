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

#### 5.测试生命周期

例子

```vue
// 父组件
<template>
  <div>
    <Child v-if="visible" />
    <button @click="onToggle">Toggle</button>
  </div>
</template>
<script setup lang="ts">
import Child from './Child.vue';
import { provide, ref } from 'vue';
const visible = ref(true);
const timer = ref(null);
const count = ref(0);
provide('count', count);
provide('timer', timer);
const onToggle = () => {
  visible.value = !visible.value;
}
</script>
// 子组件
<script setup lang="ts">
import { onMounted, inject, onUnmounted } from 'vue';

const timer = inject<any>('timer');
const count = inject<any>('count');
onMounted(() => {
  timer.value = window.setInterval(() => {
    count.value++;
  }, 1000);
});
onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<template>
  <div>
    <p>Child Component: {{ count }}</p>
  </div>
</template>
```

测试

```tsx
import { mount } from '@vue/test-utils';
import isProvideInject from '@/components/isProvideInject.vue';
import ChildComponent from '@/components/Child.vue';
import { describe, expect, it } from 'vitest';

interface InjectType {
  count: number;
  timer: number;
}
describe('Lifecycle', () => {
  it('The timer will work abnormally when the child component is toggled', async () => {
    const fatherWrapper = mount(isProvideInject);
    const child = fatherWrapper.findComponent(ChildComponent);
    const btn = fatherWrapper.find('button');
    // exists: 断言 Wrapper 或 WrapperArray 是否存在
    // toBeTruthy: 会将检查值转换为布尔值，断言该值是否为 true 。该方法在当你不关心检查值的内容，而只想知道它是否可以转换为 true 时很有用。
    expect(child.exists()).toBeTruthy(); // 断言child是存在

    await delay(1000);
    const firstChildCountData = (child.vm as InjectType).count;
    // toThrowErrorMatchingSnapshot: 获取快照值 如果是Error 将抛出错误信息
    expect(firstChildCountData).toMatchInlineSnapshot('1');

    await btn.trigger('click'); // 触发点击事件
    expect(child.exists()).toBeTruthy(); // 断言 child 不存在

    await delay(1000);
    const secondChildCount = (child.vm as InjectType).count;
    expect(secondChildCount).toMatchInlineSnapshot('1');

    await btn.trigger('click');
    // 断言child组件存在
    expect(fatherWrapper.findComponent(ChildComponent).exists()).toBeTruthy();

    await delay(1000);
    const thirdChildCount = (child.vm as InjectType).count;
    expect(thirdChildCount).toMatchInlineSnapshot('2');

    await delay(1000);
    const fourthChildCount = (child.vm as InjectType).count;
    expect(fourthChildCount).toMatchInlineSnapshot('3');
  });
});

function delay(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
```

#### 6.测试nextTick

例子

```vue
<template>
  <div>
    {{ count }}
  </div>
  <button ref="btn" @click="onClick">点击</button>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const btn = ref<HTMLButtonElement>();
const onClick = () => {
  count.value++;
  console.log(count.value === 1);
};
</script>
```

测试

```tsx
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import nextTick from '@/components/nextTick.vue';
describe('should nextTick', () => {
  it('work nextTick', async () => {
    let printLog = '';
    /**
     * vi.fn  为函数创建一个监听，当每次调用函数时，会存储其调用参数 返回值 实例。
     * console.log 该函数被vi.fn创建的监听函数赋值 当出现console.log被调用时 就会触发fn的回调函数
     */
    console.log = vi.fn((log: string) => {
      printLog = log?.toString()?.trim();
    });
    const wrapper = mount(nextTick);
    const divEl = wrapper.find('div');
    expect(divEl.text()).toMatchInlineSnapshot('"0"');
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(divEl.text()).toMatchInlineSnapshot('"1"');
    expect(printLog).toMatchInlineSnapshot('"true"');
  });
});

describe('should fn', () => {
  it('work fn', () => {
    let text = 0;
    console.log = vi.fn((value: number) => {
      text = value + 1;
    });
    console.log(1);
    expect(text).toBe(2);
  });
});
```

#### 7.测试Teleport

例子

```vue
<template>
  <Teleport to="body">
    <span>
      {{ msg }}
    </span>
  </Teleport>
</template>
<script setup lang="ts">
import { Teleport } from 'vue';
const msg = 'hello vue';
</script>
```

测试

```tsx
import { describe, expect, it } from "vitest";
import TeleportComponent from "@/components/isTeleport.vue";
import { mount } from "@vue/test-utils";
describe('should teleport', () => {
  it('test teleport', () => {
    const wrapper = mount(TeleportComponent);
    // 断言 wrapper 没有 span标签 是因为已经被传送到body 里了
    expect(wrapper.findComponent('span').exists()).toBe(false);
    expect(document.querySelector('body')?.innerHTML).toMatchInlineSnapshot('"<span>hello vue</span>"')
  })
})
```

#### 8.测试阻止事件冒泡

例子

```vue
<template>
  <div @click="click1">
    <div @click.stop="click2">click me</div>
  </div>
</template>
<script setup lang="ts">
const click1 = () => {
  console.log('click1');
}
const click2 = () => {
  console.log('click2');
}
</script>
```

测试

```tsx
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import isClickStop from "@/components/isClickStop.vue";
describe('should click.stop', () => {
  it('stake click.stop', async () => {
    const list: string[] = [];
    console.log = vi.fn((val: string) => {
      list.push(val);
    });
    const wrapper = mount(isClickStop);
    // findAll：查找所有的div元素
    await wrapper.findAll('div')[1].trigger('click');
    expect(list.length).toBe(1);
  })
})
```

#### 9.测试Props验证

例子

```vue
// 父组件
<template>
  <div>
    <Button type="text" />
  </div>
</template>
<script setup lang="ts">
import Button from "@/components/Botton.vue";
</script>

// 子组件
<template>
  <button>{{ props.type }}</button>
</template>
<script setup lang="ts">
interface Props {
  type: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
});
</script>
```

测试

```tsx
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import isPropsValidator from '@/components/isPropsValidator.vue';
import Button from '@/components/Botton.vue';
describe('should props', () => {
  it('test props', () => {
    const fatherWrapper = mount(isPropsValidator);
    const child = fatherWrapper.findComponent(Button);
    expect(child.exists()).toBeTruthy();
    expect(child.vm.type).toBe('text');
  });
});
```

#### 10.测试toRaw

例子

```vue
<template>
  <div>
    {{}}
  </div>
</template>
<script setup lang="ts">
import {reactive, isReactive, toRaw} from "vue";
const state = {count: 1};
const reactiveState = reactive(state);
/**
 * toRaw: 根据一个 Vue 创建的代理返回其原始对象
 * 使用范围：reactive、readonly、shallowReactive、shallowReadonly
 * 这是一个可以用于临时读取而不引起代理访问/跟踪开销，
 * 或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。
 */
console.log(toRaw(reactiveState) === state); // 期望获得的值： true

const info = {count: 1};
const reactiveInfo = reactive(info);

/**
 * isReactive: 用于判断是否为代理对象
 * toRaw：将响应对象转为原始对象
 */
console.log(isReactive(toRaw(reactiveInfo))); // 期望获得的值： false
</script>
```

测试

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import isToRaw from '@/components/ToRaw.vue';
describe('should toRaw API', () => {
  it('take toRaw', () => {
    let res: string[] = [];
    console.log = vi.fn((log: string) => {
      res.push(log);
    });
    mount(isToRaw);
    expect(JSON.stringify(res)).toBe(JSON.stringify([true, false])); // 匹配是否和isToRaw组件console的值一样
  });
});
```

