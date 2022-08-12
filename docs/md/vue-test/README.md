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
 * 请注意，虽然在视图上能够看到count已经被修改了，但是并不会触发Wath，这是执行同步代码后，直接先于watch进入 到 effect 去了，导致在视图上看起来已经赋值成功了
 然后如果在异步代码中执行一下的代码，并不会触发视图的更新
 所以要考虑同步和异步的问题
*/
// 不会更新
//Promise.resolve().then(() => {
// state.value.count = 2; // 不会被触发更改
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

#### 11.测试effectScope

```tsx
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';

import isEffectScoped from '@/components/isEffectScope.vue';

function delay(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

describe('EffectScope', () => {
  it('should work', async () => {
    const result: string[] = [];
    console.log = vi.fn((log: string) => {
      result.push(log);
    });
    mount(isEffectScoped);
    await delay(1000);
    expect(JSON.stringify(result)).toBe(JSON.stringify(['Count: 2', 4, 'Count: 4']));
  });
});
```

#### 12.测试useToggle

```vue
<template>
  <p>{{ state ? '1' : '2' }}</p>
  <button @click="() => !isRef(toggle) && toggle()">toggle</button>
</template>
<script setup lang="ts">
import { isRef, ref, unref } from 'vue';
function useToggle(initialValue = false) {
  const state = ref(initialValue);
  function toggle() {
    // unref: 语法糖，该方法的参数如果是一个ref代理对象，则会自动获取value，否则返回原参数
    state.value = !unref(state);
  }
  return [state, toggle];
}
let [state, toggle] = useToggle(false);
</script>
```

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import isToggleVue from '@/components/isToggle.vue';
describe('should toggled', () => {
  it('test toggled', async () => {
    const wrapper = mount(isToggleVue);
    const p = wrapper.find('p');
    const btn = wrapper.find('button');
    expect(p.text()).toBe('2');
    await btn.trigger('click');
    expect(p.text()).toBe('1');
    await btn.trigger('click');
    expect(p.text()).toBe('2');
  });
});
```

#### 13.测试useCounter

例子

```vue
<script setup lang="ts">
import { ref } from 'vue';
interface UseCounterOptions {
  min?: number;
  max?: number;
}

function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const count = ref(initialValue);
  // Infinity 无穷大
  // -Infinity 无穷小
  const { max = Infinity, min = -Infinity } = options;
  // + 法
  function inc(val = 1) {
    // Math.min 比较数值中最小的数。如果任一参数不能转换为数值，则返回NaN
    return (count.value = Math.min(max, count.value + val));
  }
  // - 法
  function dec(val = 1) {
    // 返回给定的一组数字中的最大值。如果给定的参数中至少有一个参数无法被转换成数字，则会返回 NaN
    return (count.value = Math.max(min, count.value - val));
  }
  // 重置
  function reset(val = initialValue) {
    return (count.value = val);
  }

  return {
    inc,
    dec,
    reset,
    count,
  };
}
/**
 * 第一个参数为默认起始值
 * 第二个参数为区间配置参数
 * 最大值不能 > 11 最小值不能 < 5
 */
const { count, inc, dec, reset } = useCounter(0, { min: 0, max: 11 });
</script>

<template>
  <p>Count: {{ count }}</p>
  <button @click="inc()">inc</button>
  <button @click="dec()">dec</button>
  <button @click="reset()">reset</button>
</template>
```

测试

```tsx
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
```

#### 14.测试until

例子

```vue
<script setup lang="ts">
import { ref, Ref } from 'vue';

const count = ref(0);

/**
 * 利用async await语法糖特性 会返回Promise then的回调结果
 * toBe 形成闭包 对initial有引用 所以在调用toBe时，将参数赋值给initial 并resolve出去
 */

function until(initial: Ref<number>) {
  function toBe(value: number) {
    return new Promise(resolve => {
      initial.value = value;
      resolve(initial.value);
    });
  }

  return {
    toBe,
  };
}

async function increase() {
  count.value = 0;
  setInterval(() => {
    count.value++;
  }, 1000);
  await until(count).toBe(3);
  console.log(count.value === 3); // Make sure the output is true
}
</script>

<template>
  <p @click="increase">Increase</p>
</template>
```

测试

```tsx
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
```

#### 15.测试useLocalstorage

例子

```vue
<script setup lang="ts">
import { ref, Ref, watchEffect, watch } from 'vue';

/**
 * Implement the composable function
 * Make sure the function works correctly
 */
function useLocalStorage(key: string, initialValue: any, resetVal = false) {
  const res: Ref<any> = ref(localStorage.getItem(key) ?? initialValue);
  const _resetVal = ref(resetVal);
  // 立即调用回调函数 并收集依赖 依赖发生变化时 调用函数
  watchEffect(() => {
    localStorage.setItem(key, res.value);
  });
  watch(_resetVal, () => {
    if (_resetVal.value === true) {
      res.value = initialValue;
      localStorage.removeItem(key);
    }
  });
  return [res, _resetVal] as const;
}

const [counter, _resetVal] = useLocalStorage('counter', 0);

// We can get localStorage by triggering the getter:
console.log(counter.value);

// And we can also set localStorage by triggering the setter:

const update = () => counter.value++;
const reset = () => {
  _resetVal.value = true;
};
</script>

<template>
  <p>Counter: {{ counter }}</p>
  <button @click="update">Update</button>
  <button @click="reset">清空storage</button>
</template>
```

测试

```tsx
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import useLocalStoragesApp from "@/components/useLocalStorage.vue";
describe('should useLocalStorages', () => {
  it('test useLocalStorages', async () => {
    let wrapper = mount(useLocalStoragesApp);
    const p = wrapper.find('p');
    const btn = wrapper.find('button');
    expect(p.text()).toBe('Counter: 0');
    await btn.trigger('click');
    expect(p.text()).toBe('Counter: 1');

    // 卸载组件
    wrapper.unmount();

    // 重新挂载组件
    wrapper = mount(useLocalStoragesApp);
    expect(wrapper.find('p').text()).toBe('Counter: 1')
  })
})
```

#### 16.测试 useFocus

例子

```vue
<script setup lang="ts">
import { ref, Ref } from 'vue';

const state = ref(true);

/**
 * Implement the custom directive
 * Make sure the input element focuses/blurs when the 'state' is toggled
 *
 */
/**
 * 一个自定义指令被定义为一个包含类似于组件的生命周期钩子的对象 钩子接收指令绑定到的元素
 * 在 <script setup> 中，任何以 v 开头的驼峰式命名的变量都可以被用作一个自定义指令。在上面的例子中，vFocus 即可以在模板中以 v-focus 的形式使用
 * 文档地址：https://staging-cn.vuejs.org/guide/reusability/custom-directives.html#introduce
 */
const VFocus = {
  mounted(el: any, binding: { value: any }, vnode: any, prevVnode: any) {
    const input = el;
    const res: Ref<any> = ref(binding.value);
    if (res.value) {
      input.focus();
    }
  },
  updated(el: any, binding: { value: any }, vnode: any, prevVnode: any) {
    const input: HTMLInputElement = el;
    const res: Ref<any> = ref(binding.value);
    if (res.value) {
      input.focus();
    } else {
      input.blur();
    }
  },
};

setInterval(() => {
  state.value = !state.value;
}, 2000);
</script>

<template>
  <input v-focus="state" type="text" />
</template>
```

#### 17.测试 useFunctionComponent

例子

```vue
<template>
  <list-component :list="list" :active-index="activeIndex" @toggle="toggle" :colorActive="colorActive" />
</template>
<script setup lang="ts">
import { ref, h, FunctionalComponent, reactive, watchEffect, watch } from 'vue';
const colorActive = reactive({
  color: 'red',
});
const ListComponent: FunctionalComponent<{ list: any[]; activeIndex: number; colorActive: Record<string, any> }> = (
  props,
  { emit }
) => {
  const { list, activeIndex, colorActive } = props;
  const onToggle = (index: number) => {
    emit('toggle', index);
  };
  const List = () => {
    return list.map((item, index) => {
      watch(
        () => activeIndex,
        () => {
          colorActive.color = index === activeIndex ? 'red' : '';
        }
      );
      return h(
        'li',
        {
          onClick: () => onToggle(index),
          class: { red: index === activeIndex },
        },
        item.name
      );
    });
  };
  // 函数式组件可以像普通组件一样被注册和使用。如果你将一个函数作为第一个参数传入 h，它将会被当作一个函数式组件来对待。
  return h('ul', {}, List());
};
// 指定 props 选项
// 大多数常规组件的配置选项在函数式组件中都不可用，除了 props 和 emits。我们可以给函数式组件添加对应的属性来声明它们：
// 如果这个 props 选项没有被定义，那么被传入函数的 props 对象就会像 attrs 一样会包含所有 attribute。除非指定了 props 选项，否则每个 prop 的名字将不会基于驼峰命名法被一般化处理。
ListComponent.props = ['list', 'activeIndex', 'colorActive'];
ListComponent.emits = ['toggle'];
ListComponent.inheritAttrs = true;

const list = [
  {
    name: 'John',
  },
  {
    name: 'Doe',
  },
  {
    name: 'Smith',
  },
];

const activeIndex = ref(0);

function toggle(index: number) {
  activeIndex.value = index;
}
</script>

<style>
.red {
  color: v-bind('colorActive.color');
}
</style>
```

测试

```ts
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import useLocalStoragesApp from "@/components/useLocalStorage.vue";
describe('should useLocalStorages', () => {
  it('test useLocalStorages', async () => {
    let wrapper = mount(useLocalStoragesApp);
    const p = wrapper.find('p');
    const btn = wrapper.find('button');
    expect(p.text()).toBe('Counter: 0');
    await btn.trigger('click');
    expect(p.text()).toBe('Counter: 1');

    // 卸载组件
    wrapper.unmount();

    // 重新挂载组件
    wrapper = mount(useLocalStoragesApp);
    expect(wrapper.find('p').text()).toBe('Counter: 1')
  })
})
```

#### 18.测试 useMouse

例子

```vue
<template>Mouse position is at: {{ x }}, {{ y }}</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

function useEventListener<T extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  event: T,
  callback: (this: HTMLElement, ev: HTMLElementEventMap[T]) => void
) {
  // 组件挂载时绑定事件
  onMounted(() => {
    target.addEventListener(event, callback);
  });
  // 组件卸载时移除事件
  onUnmounted(() => {
    target.removeEventListener(event, callback);
  });
}

function useMouse() {
  const x = ref(0);
  const y = ref(0);

  useEventListener(window, 'mousemove', event => {
    x.value = event.pageX;
    y.value = event.pageY;
  });

  return {
    x,
    y,
  };
}

const { x, y } = useMouse();
</script>
<style></style>
```

测试

```ts
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
```

