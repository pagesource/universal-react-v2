module.exports = {
  transform: { '\\.(js|jsx)?$': 'babel-jest' },
  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/public/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/node_modules/',
    '<rootDir>/index.js',
    '<rootDir>/jest.config.js',
    '<rootDir>/babel.config.js',
    '<rootDir>/.eslintrc.js',
    '<rootDir>/templates',
    '<rootDir>/scripts'
  ],
  transformIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/public/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/config/',
    '<rootDir>/jest.config.js',
    '<rootDir>/node_modules/',
    '<rootDir>/.eslintrc.js'
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
  timers: 'fake',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'json', 'json-summary', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  }
};
