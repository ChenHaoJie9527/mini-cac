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
