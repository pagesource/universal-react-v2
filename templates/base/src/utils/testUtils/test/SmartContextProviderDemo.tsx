import { WithContextProvider } from 'smart-context';
const initialState = {
  name: 'Smart Context'
};

const actionsConfig = {
  setName: ['name']
};

const displayName = 'nameContext';

/* Configuration */
const config = {
  initialState,
  actionsConfig,
  displayName,
  debug: true
};

const NameContextProvider: React.FunctionComponent = ({ children }) => {
  return <>{children}</>;
};
export default WithContextProvider(NameContextProvider, [config]);
