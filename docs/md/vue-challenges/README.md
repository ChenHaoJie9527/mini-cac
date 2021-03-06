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

