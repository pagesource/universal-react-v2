import { useContext } from 'react';
import { getContext } from 'smart-context';

const SmartContextDemo = () => {
  const {
    state: { name },
    actions: { setName }
  } = useContext(getContext('nameContext'));
  return <h1 data-testid="name">{name}</h1>;
};
export default SmartContextDemo;
