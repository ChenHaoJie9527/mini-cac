<template>
  <TreeVue :data="treeData" />
</template>

<script setup lang="ts">
import { ref, FunctionalComponent, h } from 'vue';
import TreeVue from './Tree.vue';
// interface TreeData {
//   key: string;
//   title: string;
//   children: TreeData[];
// }
const treeData = ref([
  {
    key: '1',
    title: 'Parent 1',
    children: [
      {
        key: '1-1',
        title: 'child 1',
      },
      {
        key: '1-2',
        title: 'child 2',
        children: [
          {
            key: '1-2-1',
            title: 'grandchild 1',
          },
          {
            key: '1-2-2',
            title: 'grandchild 2',
          },
        ],
      },
    ],
  },
  {
    key: '2',
    title: 'Parent 2',
    children: [
      {
        key: '2-1',
        title: 'child 1',
        children: [
          {
            key: '2-1-1',
            title: 'grandchild 1',
          },
          {
            key: '2-1-2',
            title: 'grandchild 2',
          },
        ],
      },
      {
        key: '2-2',
        title: 'child 2',
      },
    ],
  },
]);



// const Tree: FunctionalComponent<{ data: any[] }> = ({ data }, ctx) => {
//   const List = () => {
//     return data.map((item, index) => {
//       return h('li', { key: item.key }, item.title);
//     });
//   };
//   return h('ul', {}, List());
// };
// Tree.props = ['treeData'];
</script>
