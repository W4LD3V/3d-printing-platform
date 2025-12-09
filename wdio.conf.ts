import { join } from 'node:path';
import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  specs: [join(__dirname, 'features/**/*.feature')],
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome'
    }
  ],
  logLevel: 'info',
  framework: 'cucumber',
  cucumberOpts: {
    require: [join(__dirname, 'features/steps/**/*.ts')],
    timeout: 60_000
  },
  services: ['chromedriver'],
  reporters: ['spec'],
  autoCompileOpts: {
    tsNodeOpts: {
      transpileOnly: true,
      project: 'tsconfig.json'
    }
  }
};
