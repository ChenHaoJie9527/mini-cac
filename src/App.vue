<script setup lang="ts">
import ButtonSlot from '@/components/ButtonSlot.vue';
import isWatch from '@/components/isWatch.vue';
import isShallowRefVue from './components/isShallowRef.vue';
import isToggleVue from './components/isToggle.vue';
import useCounter from '@/components/useCounter.vue';
import useLocalStorage from '@/components/useLocalStorage.vue';
import useFocusVue from './components/useFocus.vue';
import useDebounceVue from './components/useDebounce.vue';
import useFuncnalComponentVue from './components/useFuncnalComponent.vue';
import useMouseVue from './components/useMouse.vue';
import h from '@/components/h.vue';
import useClickAndKeyword from '@/components/useClickAndKeyword.vue';
import useCustomElement from '@/components/useCustomElement.vue';
import customRef from '@/components/customRef.vue';
import VModels from '@/components/VModels.vue';
import TreeComponent from '@/components/TreeComponent.vue';
import RefFamilyMeals from '@/components/ref全家桶.vue';
import isNextTick from '@/components/nextTick.vue';
import Icon from '@/components/Icon.vue';
</script>

<template>
  <div>Hello Vitest!</div>
  <Icon :size="14" color="red">亮晶晶</Icon>
  <ButtonSlot>hello Vitest!</ButtonSlot>
  <isWatch />
  <isShallowRefVue />
  <isToggleVue />
  <useCounter />
  <useLocalStorage />
  <useFocusVue />
  <useDebounceVue />
  <useFuncnalComponentVue />
  <useMouseVue />
  <h />
  <useClickAndKeyword />
  <useCustomElement />
  <customRef />
  <VModels />
  <TreeComponent />
  <RefFamilyMeals />
  <isNextTick />
</template>
