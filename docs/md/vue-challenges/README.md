## Vue-challenges

------

概述：Vue3练习集，主要用于锻炼常用的api等相关例子。

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

  