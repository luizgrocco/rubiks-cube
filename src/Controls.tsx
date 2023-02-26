import { useControls } from 'leva';

const Controls = () => {
  const toggle = useControls({ toggle: true });

  console.log({ toggle });

  return <></>;
};

export default Controls;
