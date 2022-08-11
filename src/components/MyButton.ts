// import { h, FunctionalComponent } from 'vue';

// 纯函数版本
// const MyButton: FunctionalComponent<{ disabled: boolean }> = ({ disabled }, { emit, slots }) => {
//   console.log('slots', slots);
//   return h(
//     'button',
//     {
//       disabled,
//       onClick: (event: HTMLButtonElement) => {
//         emit('customClick', event);
//       },
//     },
//     slots.default!()
//   );
// };
// MyButton.props = ['disabled'];
// MyButton.emits = ['customClick'];

// export default MyButton;

// render函数版本
import { defineComponent, h } from 'vue';

const myButton = defineComponent({
  name: 'MyButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['customClick'],
  render() {
    return h('button', {
      disabled: this.$props.disabled,
      onClick: () => {
        this.$emit('customClick');
      }
    }, this.$slots)
  }
});

export default myButton;
