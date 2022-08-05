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
