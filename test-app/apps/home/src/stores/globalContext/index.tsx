/* eslint-disable */
import React from 'react';
import { WithContextProvider } from 'smart-context';

const initialState = {
  welcomeText: 'Universal React'
};

const actionsConfig = {
  updateWelcomeText: ['welcomeText']
};

export const displayName = 'globalContext';

/* Configuration */
const config = {
  initialState,
  actionsConfig,
  displayName,
  debug: true
};

const GlobalContextProvider = ({ children }) => {
  return <>{children}</>;
};

export default WithContextProvider(GlobalContextProvider, [config]);
