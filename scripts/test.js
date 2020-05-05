const jest = require('jest');

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

process.on('unhandledRejection', (err) => {
  throw err;
});

const argv = process.argv.slice(2);

jest.run(argv);
