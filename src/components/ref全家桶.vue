<template>
  <div>
    <h1>msg</h1>
    <p>
      <button @click="updateRef(count - 1)">减少</button>
      {{ count }}
      <button @click="updateRef(count + 1)">增加</button>
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref, Ref, reactive, isRef, unref, toRef } from 'vue';
const initial = ref(10);
const count = ref(0);

// 挑战1：更新 ref
const updateRef = (value: number) => {
  count.value = value;
};

// 挑战2：检查 count 是否为 一个 ref 对象
console.log(isRef(initial));

// 挑战3：如果参数是一个 ref，则返回内部值，否则返回参数本身 确保一下输入为 true
function initialCount(value: number | Ref<number>) {
  console.log(unref(value) === 10);
}
initialCount(initial);

/**
 * 挑战 4:
 * 为源响应式对象上的某个 `property` 新创建一个 `ref`。
 * 然后,`ref` 可以被传递，它会保持对其源`property`的响应式连接。
 * 确保以下输出为true
 */
const state = reactive({
  foo: 1,
  bar: 2,
});
const fooRef = toRef(state, 'foo');

// 修改引用将更新原引用
fooRef.value++;
console.log('state.foo', state.foo); // 2
console.log('fooRef', fooRef.value); // 2
console.log(fooRef.value === state.foo); // true

// 修改原引用也会更新`ref`
state.foo++; // 3
console.log('state.foo', state.foo); // 3
console.log('fooRef', fooRef.value); // 3
console.log(fooRef.value === 3); // true
</script>
