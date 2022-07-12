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
