module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['**/*.(t|j)s'],
    coveragePathIgnorePatterns: ['src/main.functions.ts'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '@src/(.*)': '<rootDir>/src/$1',
    },
    setupFiles: [],
    testPathIgnorePatterns: [],
    clearMocks: true,
};
