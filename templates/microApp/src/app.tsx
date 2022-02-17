/** Root Component */

import React from 'react';
import './styles/index.css';

const App = () => {
  return (
    <div data-testid="AppComponent" className="micro-app">
      <h1>Hi there, I am React micro-app from webpack 5.</h1>
    </div>
  );
};

export default App;
