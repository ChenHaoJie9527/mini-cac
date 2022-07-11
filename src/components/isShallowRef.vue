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
 * 请注意，虽然在视图上能够看到count已经被修改了，但是并不会触发Wath，这是执行同步代码后，直接先于watch进入	到 effect 去了，导致在视图上起来已经赋值成功了
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
