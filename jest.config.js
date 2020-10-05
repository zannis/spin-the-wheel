module.exports = {
    roots: [
        '<rootDir>/src'
    ],
    testMatch: ['**/__tests__/(unit|integration)/**/*.(js|ts)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    setupFiles: ['./src/__tests__/jest.setup.ts', 'jest-canvas-mock']
}
