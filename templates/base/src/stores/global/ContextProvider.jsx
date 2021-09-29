import { WithContextProvider } from "smart-context";
import ContextExample from './ContextExample';

const initialState = { steps: 1, counter: 0 };

// Two types of action definitions
const actionsConfig = {
  setSteps: ["steps"],
  setCounter: (counter) => (state) => ({ ...state, counter }),
};

const displayName = "globalContext";

/* Configuration */
const config = {
  initialState,
  actionsConfig,
  displayName,
  debug: true,
};

const GlobalContextProvider = (props) => {
  return (
    <div>
      smart-context example
      <ContextExample />
      {props.children}
    </div>
  )
}

export default WithContextProvider(GlobalContextProvider, [config]);