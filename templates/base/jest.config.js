module.exports = {
    testMatch: ['<rootDir>/**/__tests__/*(*.)@(spec|test).[jt]s?(x)'],
    moduleDirectories: ['node_modules'],
    testPathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/out/'],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: '<rootDir>/reports/coverage',
    collectCoverageFrom: [
        '**base/src/**/**/*.js',
        '**base/src/**/*.js',
        '!**base/components/**/*.mock.js',
        '!**base/components/**/*.story.js',
        '!**lib/components/**/*.styles.js',
        '!**base/styles/**/*.js',
        '!**/node_modules/**',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
    ],
    coverageReporters: ['lcov', 'json', 'text-summary'],
};
