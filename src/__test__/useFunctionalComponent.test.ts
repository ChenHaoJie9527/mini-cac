import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import useFuncnalComponent from '@/components/useFuncnalComponent.vue';

describe('should use-function-component', () => {
  it('test function-component', async () => {
    const wrapper = mount(useFuncnalComponent);
    const list: VueWrapper<any> = wrapper.findComponent({ name: 'list-component' });
    expect(list.vm).toBeUndefined();
    const ul = list.find('ul');
    expect(ul.exists()).toBeTruthy();
    const [item1, className1] = useListItemClass(list, 'li', 0);
    const [item2, className2] = useListItemClass(list, 'li', 1);
    expect(className1).toBe('red');
    expect(className2).toBeUndefined();

    await item2.trigger('click');

    expect(item1.classes()[0]).toBeUndefined();
    expect(item2.classes()[0]).toBe('red');
  });
});

function useListItemClass(list: VueWrapper<any>, el: 'li', index = 0) {
  const item = list.findAll(el)[index];
  const className = item.classes()[index];
  return [item, className] as const;
}
