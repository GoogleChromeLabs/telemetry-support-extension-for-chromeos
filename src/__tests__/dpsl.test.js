/**
 * Copyright 2021 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {dpsl} from '../dpsl.js';

describe('dpsl.telemetry tests', () => {
  let originalChrome;
  beforeEach(() => {
    originalChrome = global.chrome;
  });
  afterEach(() => {
    global.chrome = originalChrome;
  });

  test('dpsl.telemetry binding exists', () => {
    expect(dpsl.telemetry).toBeDefined();
    expect(dpsl.telemetry).not.toBeNull();
  });

  test('dpsl.telemetry.getVpdInfo() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedVpdInfo = {
      'activateDate': '2021-50',
      'modelName': 'COOL-LAPTOP-CHROME',
      'serialNumber': '5CD9999999',
      'skuNumber': 'sku15',
    };
    const chrome = {
      os: {
        telemetry: {
          getVpdInfo: () => expectedVpdInfo,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getVpdInfo().then((vpdInfo) => {
      expect(vpdInfo).toEqual(expectedVpdInfo);
      done();
    });
  });

  test('dpsl.telemetry.getOemData() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedOemData = 'oemdata: response from GetLog';
    const chrome = {
      os: {
        telemetry: {
          getOemData: () => expectedOemData,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getOemData().then((oemData) => {
      expect(oemData).toEqual(expectedOemData);
      done();
    });
  });
});


describe('dpsl.diagnostics tests', () => {
  let originalChrome;
  beforeEach(() => {
    originalChrome = global.chrome;
  });
  afterEach(() => {
    global.chrome = originalChrome;
  });

  test('dpsl.diagnostics binding exists', () => {
    expect(dpsl.diagnostics).toBeDefined();
    expect(dpsl.diagnostics).not.toBeNull();
  });

  test('dpsl.diagnostics.getAvailableRoutines() returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedRoutinesList = {
          routines: ['battery_capacity', 'battery_charge', 'battery_discharge',
            'battery_health', 'cpu_cache', 'cpu_stress', 'memory'],
        };
        const chrome = {
          os: {
            diagnostics: {
              getAvailableRoutines: () => Promise.resolve(expectedRoutinesList),
            },
          },
        };
        global.chrome = chrome;

        dpsl.diagnostics.getAvailableRoutines().then((routinesList) => {
          expect(routinesList).toEqual(expectedRoutinesList);
          done();
        });
      });

  test('Routine.{getStatus(), resume(), stop()} returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedRunRoutineResponse = {id: 123456};
        const expectedRoutineStatusResponse = {
          progressPercent: 76,
          status: 'running',
          statusMessage: 'routine is running..',
        };
        const chrome = {
          os: {
            diagnostics: {
              runBatteryCapacityRoutine:
                () => Promise.resolve(expectedRunRoutineResponse),
              getRoutineUpdate:
                () => Promise.resolve(expectedRoutineStatusResponse),
            },
          },
        };
        global.chrome = chrome;

        dpsl.diagnostics.battery.runCapacityRoutine().then((routine) => {
          expect(routine).toEqual(expectedRunRoutineResponse);
          Promise.all([
            routine.getStatus(),
            routine.resume(),
            routine.stop(),
          ]).then((values) => {
            expect(values).toEqual([
              expectedRoutineStatusResponse,
              expectedRoutineStatusResponse,
              expectedRoutineStatusResponse,
            ]);
            done();
          });
        });
      });

  const testCases = [
    {
      'dpslRoutineFunction': dpsl.diagnostics.battery.runCapacityRoutine,
      'chromeOsRoutineFunction': 'runBatteryCapacityRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.battery.runHealthRoutine,
      'chromeOsRoutineFunction': 'runBatteryHealthRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.battery.runDischargeRoutine,
      'chromeOsRoutineFunction': 'runBatteryDischargeRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.battery.runChargeRoutine,
      'chromeOsRoutineFunction': 'runBatteryChargeRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.cpu.runCacheRoutine,
      'chromeOsRoutineFunction': 'runCpuCacheRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.cpu.runStressRoutine,
      'chromeOsRoutineFunction': 'runCpuStressRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.memory.runMemoryRoutine,
      'chromeOsRoutineFunction': 'runMemoryRoutine',
    },
  ];

  testCases.forEach((testCase) => {
    test(`${testCase.dpslRoutineFunction}() returns correct data`, (done) => {
      // Mock the global chrome object.
      const expectedRunRoutineResponse = {id: 123456};
      const chrome = {
        os: {
          diagnostics: {
            [testCase.chromeOsRoutineFunction]:
              () => Promise.resolve(expectedRunRoutineResponse),
          },
        },
      };
      global.chrome = chrome;

      testCase.dpslRoutineFunction().then((routine) => {
        expect(routine).toEqual(expectedRunRoutineResponse);
        done();
      });
    });
  });
});
