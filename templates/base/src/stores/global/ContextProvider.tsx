import { WithContextProvider } from 'smart-context';

const initialState = {
  // state variables initialization
};

const actionsConfig = {
  // Two types of action definitions
  // setSteps: ["steps"],
  // setCounter: (counter) => (state) => ({ ...state, counter }),
};

const displayName = 'globalContext';

/* Configuration */
const config = {
  initialState,
  actionsConfig,
  displayName,
  debug: true
};

const GlobalContextProvider: React.FunctionComponent = ({ children }) => {
  return <>{children}</>;
};

export default WithContextProvider(GlobalContextProvider, [config]);
