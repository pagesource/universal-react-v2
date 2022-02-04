import React, { useContext } from 'react';

export const Context = React.createContext('default');

export const ContextDemo: React.FunctionComponent = () => {
  const value = useContext(Context);
  return <h1 data-testid="value">{value}</h1>;
};
