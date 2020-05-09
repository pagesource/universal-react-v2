module.exports = {
    rootDir: '../',
    moduleDirectories: ['node_modules'],
    testPathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/out/'],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: '<rootDir>/reports/coverage',
    collectCoverageFrom: [
      '**/*.js',
      '**/*.jsx',
      '!**/*.mock.js',
      '!**/*.story.js',
      '!**/*.styles.js',
      '!**styles/**/*.js',
      '!**/node_modules/**'
    ],
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageReporters: ['lcov', 'json', 'text-summary'],
    transform: {
      '\\.(js|jsx)?$': 'babel-jest'
    }
  };
  