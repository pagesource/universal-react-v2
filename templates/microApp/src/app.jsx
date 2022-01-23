/** Root Component */

import React, { useState, useEffect } from 'react';
import Heading from './components/atoms/Heading';
import './styles/index.css';

const App = () => {
  const [ctr, setCtr] = useState(0);

  const clickHandler = () => {
    setCtr(ctr + 1);
  };

  useEffect(() => {
    setCtr(1);
  }, []);

  return (
    <div className="remote-app">
      <Heading />
      <button onClick={clickHandler}>Click to update counter - {ctr}</button>
    </div>
  );
};

export default App;
