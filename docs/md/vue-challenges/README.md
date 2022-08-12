## Vue-challenges

------

概述：Vue3练习集，主要用于锻炼常用的api等相关例子。

[TOC]

### 1.挑战：可写的计算属性

创建一个可写的计算属性，使得下列的例子得到预期的正确答案

```vue
<script setup lang="ts">
import { ref, computed } from "vue"

const count = ref(1)
const plusOne = computed(() => count.value + 1)

/**
 * 确保 `plusOne` 可以被写入。
 * 最终我们得到的结果应该是 `plusOne` 等于 3 和 `count` 等于 2。
*/

plusOne.value++

</script>

<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ plusOne }}</p>
  </div>
</template>

```

解题思路：

- 了解**computed**特性，该 API 用于收集依赖响应式数据，并派生出新的数据，不仅可以用set设置，也可以用get获取。

- ```vue
  <script setup lang="ts">
  import { ref, computed } from "vue"
  
  const count = ref(1)
  const plusOne = computed({
    get() {
      return count.value + 1;
    },
    set(newVal) {
      return count.value++
    }
  })
  plusOne.value++
  
  </script>
  
  <template>
    <div>
      <p>{{ count }}</p>
      <p>{{ plusOne }}</p>
    </div>
  </template>
  
  ```

  ```tex
  得到的结果分别是
  2
  3
  ```

### 2.挑战：Watch全家桶

使用 侦听器 `Watch` 来完成一下例子：

```vue
<script setup lang="ts">
import { ref, watch } from "vue"

const count = ref(0)

/**
 * 挑战 1: Watch 一次
 * 确保副作用函数只执行一次
*/
watch(count, () => {
  console.log("Only triggered once")
})

count.value = 1
setTimeout(() => count.value = 2)

/**
 * 挑战 2: Watch 对象
 * 确保副作用函数被正确触发
*/
const state = ref({
  count: 0,
})

watch(state, () => {
  console.log("The state.count updated")
})

state.value.count = 2

/**
 * 挑战 3: 副作用函数刷新时机
 * 确保正确访问到更新后的`eleRef`值
*/

const eleRef = ref()
const age = ref(2)
watch(age, () => {
  console.log(eleRef.value)
})
age.value = 18

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

解题思路：

- watch虽然可以随着组件的卸载而被移除，但是在一些特殊场景，需要手动移除。

- watch 的一些配置选项

  ```ts
  {
      immediate: true, // 用于监听响应式对象，true表示初始化后立即调用
      deep: true, // 强制进入深度监听模式
      flush: 'post'，// 用于在Watch更新回调里获取最新状态的DOM节点
  }
  ```

- 如何手动停止侦听器watch

  ```ts
  // 手动停止侦听器，可以通过调用watch方法返回的函数
  const unwatch = watch()
  ```

- ```vue
  <script setup lang="ts">
  import { ref, watch } from "vue"
  
  const count = ref(0)
  
  /**
   * Challenge 1: Watch once
   * Make sure the watch callback only triggers once
  */
  const unWatch = watch(count, () => {
    console.log("Only triggered once")
    // 移除侦听器
    unWatch()
  })
  
  count.value = 1
  setTimeout(() => count.value = 2)
  
  /**
   * Challenge 2: Watch object
   * Make sure the watch callback is triggered
  */
  const state = ref({
    count: 0,
  })
  
  watch(state, () => {
    console.log("The state.count updated")
      // deep: true 显式进入深度监听
  }, {deep: true})
  
  state.value.count = 2
  
  /**
   * Challenge 3: Callback Flush Timing
   * Make sure visited the updated eleRef
  */
  
  const eleRef = ref()
  const age = ref(2)
  watch(age, () => {
    console.log(eleRef.value)
      // flush 标记 获取最新状态的DOM节点
  }, {flush: 'post'})
  age.value = 18
  
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

### 3.挑战：refs 使用

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
    state: toRefs(state), // 会将响应对象转换成普通对象，普通对象里的每个 property 都是响应对象里的 property 的 ref，即都是经过 toRef创建的
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

### 4.挑战：shallowRef

例子

```vue
<script setup lang="ts">
import { shallowRef, watch } from 'vue';

const state = shallowRef({ count: 1 });

// Does NOT trigger
watch(
  state,
  () => {
    console.log('State.count Updated');
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

### 5.挑战：生命周期

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
    // 手动移除计时器
  clearInterval(timer.value);
});
</script>

<template>
  <div>
    <p>Child Component: {{ count }}</p>
  </div>
</template>
```

### 6.挑战：传送门

例子

```vue
<template>
// Teleport 内置组件：会将组件内部的模板 通过to 到指定的DOM节点 appendChild中
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

### 7.挑战：动态CSS

```vue
<template>
  <div class="box">hello vue</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const colorList = ref(['blue', 'yellow', 'red', 'green']);
const theme = ref('red');
setInterval(() => {
  theme.value = colorList.value[Math.floor(Math.random() * 4)];
}, 1000);
</script>
<style scoped>
.box {
  color: v-bind('theme');
}
</style>
```

### 3.挑战：阻止事件冒泡

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

### 4.挑战：Props验证

```vue
<template>
  <div>
    <Button type="text" />
  </div>
</template>
<script setup lang="ts">
import Button from "@/components/Botton.vue";
</script>

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

### 5.挑战：toRaw

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

### 6.挑战：effectScope

```vue
<template>
  <div>
    <p>
      {{ doubled }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, effectScope } from 'vue';
const scoped = effectScope();
const counter = ref(1);
const doubled = computed(() => counter.value * 2);
// 使用 `effectScope` API 使这些Effect效果在触发一次后停止
scoped.run(() => {
  watch(doubled, () => console.log(doubled.value));
  watchEffect(() => console.log(`Count: ${doubled.value}`));
});

counter.value = 2;

setTimeout(() => {
  scoped.stop();
  counter.value = 4;
});
/**
 * 总结：
 *    1. 第一次：counter定义为1， doubled计算得出为2 但并不会触发watch(初始化时不会触发)，而是会执行watchEffect得 Count: 2
 *    2. 第二次 counter被赋值， 触发computed重新计算 doubled为4 触发了scope里的watch 为4，由于watchEffect里的doubled被修改得 Count: 4
 *    3. 只会在setTimeout先把scope stop, 即把scope作用域里的依赖都清理了，之后的赋值也就不会再触发了
 */
</script>
```

### 7.挑战：useToggle

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

### 8.挑战：useCounter

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

### 9.挑战：until

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

### 10.挑战： useLocalstorage

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

### 11.挑战： useFocus

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

### 12.挑战：useFunctionComponent

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

### 13.挑战：useMouse

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

### 14.全局选择器 :global

```vue
<template>
  <p>Hello Vue.js</p>
</template>

<style scoped>
p {
  font-size: 20px;
  color: red;
  text-align: center;
  line-height: 50px;
}

/*
  :global 伪类选择器 全局选择器 可以在局部组件中使用该伪类影响全局的某个元素
  文档地址：https://staging-cn.vuejs.org/api/sfc-css-features.html#scoped-css
*/
:global(body) {
  width: 100vw;
  height: 100vh;
  background-color: burlywood;
}
</style>
```

### 15. h 渲染函数

父组件 引用 h函数返回的VNode

文档：https://staging-cn.vuejs.org/api/render-function.html#h

```vue
<template>
  <MyButton :disabled="false" @customClick="customClick">MyButton</MyButton>
</template>
<script lang="ts" setup>
import MyButton from '@/components/MyButton';
const customClick = () => {
  console.log('onClick');
};
</script>
```

使用 h 函数 渲染的 组件 MyButton

```ts
import { defineComponent, h } from 'vue';

const myButton = defineComponent({
  name: 'MyButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['customClick'],
  render() {
    return h('button', {
      disabled: this.$props.disabled,
      onClick: () => {
        this.$emit('customClick');
      }
    }, this.$slots)
  }
});

export default myButton;te
```

使用 render 函数渲染的组件 MyButton

```ts
import { h, FunctionalComponent } from 'vue';

// 纯函数版本
const MyButton: FunctionalComponent<{ disabled: boolean }> = ({ disabled }, { emit, slots }) => {
  console.log('slots', slots);
  return h(
    'button',
    {
      disabled,
      onClick: (event: HTMLButtonElement) => {
        emit('customClick', event);
      },
    },
    slots.default!()
  );
};
MyButton.props = ['disabled'];
MyButton.emits = ['customClick'];

export default MyButton;
```

