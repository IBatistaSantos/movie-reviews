/* eslint-disable @typescript-eslint/no-var-requires */

const config = require('./jest.config');
delete config.testRegex;

config.testMatch = ['**/*.test.ts'];
config.setupFilesAfterEnv = ['./test/jest.setup.ts'];
module.exports = config;
