import { h, FunctionalComponent } from 'vue';

const MyButton: FunctionalComponent<{ disabled: boolean }> = ({ disabled }, { emit, slots }) => {
  console.log('slots', slots);
  return h(
    'button',
    {
      disabled,
      onClick: (event: HTMLButtonElement) => {
        emit('customClick', event);
      },
    },
    slots.default!()
  );
};
MyButton.props = ['disabled'];
MyButton.emits = ['customClick'];

export default MyButton;
