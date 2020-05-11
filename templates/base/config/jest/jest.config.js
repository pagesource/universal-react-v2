module.exports = {
    rootDir: '../../',
    moduleDirectories: ['node_modules'],
    testPathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/out', '<rootDir>/build'],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: '<rootDir>/reports/coverage',
    collectCoverageFrom: [
      'src/**/*.js',
      'src/**/*.jsx',
      'store/**/*.js', 
      '!**/*.mock.js',
      '!**/*.story.js',
      '!**/*.styles.js',
      '!**styles/**/*.js',
      '!**/node_modules/**'
    ],
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageReporters: ['lcov', 'json', 'text-summary'],
    coverageThreshold: {
      global: {
        "branches": 30,
        "functions": 30,
        "lines": 30,
        "statements": 30
      }
    },
    transform: {
      '\\.(js|jsx)?$': 'babel-jest'
    }
  };
  