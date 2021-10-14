const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');

// tests if global scope is binded to window
if (isBrowser()) {
  const { worker } = require('./browser');
  worker.start();
}

const isNode = new Function('try {return this===global;}catch(e){return false;}');

// tests if global scope is binded to "global"
if (isNode()) {
  const { server } = require('./server.js');
  server.listen();
}
