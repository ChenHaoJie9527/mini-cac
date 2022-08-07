<template>
  <list-component :list="list" :active-index="activeIndex" @toggle="toggle" />
</template>
<script setup lang="ts">
import { ref, h, FunctionalComponent, reactive } from 'vue';

const ListComponent: FunctionalComponent<{ list: any[]; activeIndex: number }> = (props, { emit }) => {
  const { list, activeIndex } = props;
  const onToggle = (index: number) => {
    emit('toggle', index);
  };
  const List = () => {
    return list.map((item, index) => {
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
  return h('ul', {}, List());
};
ListComponent.props = ['list', 'activeIndex'];
ListComponent.emits = ['toggle'];

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
  color: red;
}
</style>
