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

  