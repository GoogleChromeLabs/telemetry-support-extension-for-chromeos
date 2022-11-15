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

const {dpsl} = require('../dpsl.js');

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

  test('dpsl.telemetry.getCpuInfo() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedCpuInfo = {
      'numTotalThreads': 2147483647,
      'architecture': 'armv7l',
      'physicalCpus': [{
        'modelName': 'i9',
        'logicalCpus': [{
          'maxClockSpeedKhz': 2147473647,
          'scalingMaxFrequencyKhz': 1073764046,
          'scalingCurrentFrequencyKhz': 536904245,
          'idleTimeMs': 0,
          'cStates': [{
            'name': 'C1',
            'timeInStateSinceLastBootUs': 1125899906875957,
          },
          {
            'name': 'C2',
            'timeInStateSinceLastBootUs': 1125899906877777,
          }],
        }],
      }, {
        'modelName': 'i9-low-powered',
        'logicalCpus': [{
          'maxClockSpeedKhz': 1147494759,
          'scalingMaxFrequencyKhz': 1063764046,
          'scalingCurrentFrequencyKhz': 936904246,
          'idleTimeMs': 0,
          'cStates': [{
            'name': 'CX',
            'timeInStateSinceLastBootUs': 1125888806877777,
          }],
        }],
      }],
    };
    const chrome = {
      os: {
        telemetry: {
          getCpuInfo: () => expectedCpuInfo,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getCpuInfo().then((cpuInfo) => {
      expect(cpuInfo).toEqual(expectedCpuInfo);
      done();
    });
  });

  test('dpsl.telemetry.getInternetConnectivityInfo() returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedInternetInfo = {
          'networks': [{
            'type': 'wifi',
            'state': 'online',
            'macAddress': '00:00:5e:00:53:af',
            'ipv4Address': '192.168.123.456',
            'ipv6Addresses': ['FE80:CD00:0000:0CDE:1257:0000:211E:729C'],
            'signalStrength': 42,
          },
          {
            'type': 'ethernet',
            'state': 'disabled',
            'macAddress': '00:af:5e:00:53:00',
            'ipv4Address': '1.1.1.1',
            'ipv6Addresses': [],
            'signalStrength': 100,
          },
          ]};

        const chrome = {
          os: {
            telemetry: {
              getInternetConnectivityInfo: () => expectedInternetInfo,
            },
          },
        };
        global.chrome = chrome;

        dpsl.telemetry.getInternetConnectivityInfo()
            .then((internetInfo) => {
              expect(internetInfo)
                  .toEqual(expectedInternetInfo);
              done();
            });
      });

  test('dpsl.telemetry.getMemoryInfo() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedMemoryInfo = {
      'totalMemoryKiB': 2147483647,
      'freeMemoryKiB': 2147483646,
      'availableMemoryKiB': 2147483645,
      'pageFaultsSinceLastBoot': 4611686018427388000,
    };
    const chrome = {
      os: {
        telemetry: {
          getMemoryInfo: () => expectedMemoryInfo,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getMemoryInfo().then((memoryInfo) => {
      expect(memoryInfo).toEqual(expectedMemoryInfo);
      done();
    });
  });

  test('dpsl.telemetry.getNonRemovableBlockDevicesInfo() returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedNonRemovableBlockDevicesInfo = {
          'name': 'TestName',
          'type': 'TestType',
          'size': '1000000',
        };
        const chrome = {
          os: {
            telemetry: {
              getNonRemovableBlockDevicesInfo:
                () => expectedNonRemovableBlockDevicesInfo,
            },
          },
        };
        global.chrome = chrome;

        dpsl.telemetry.getNonRemovableBlockDevicesInfo()
            .then((nonRemovableBlockDevicesInfo) => {
              expect(nonRemovableBlockDevicesInfo)
                  .toEqual(expectedNonRemovableBlockDevicesInfo);
              done();
            });
      });

  test('dpsl.telemetry.getBatteryInfo() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedBatteryInfo = {
      'chargeFull': 9000000000000000,
      'chargeFullDesign': 3000000000000000,
      'chargeNow': 7777777777.777,
      'currentNow': 0.9999999999999,
      'cycleCount': 100000000000000,
      'manufactureDate': '2020-07-30',
      'modelName': 'Google Battery',
      'serialNumber': 'abcdef',
      'status': 'Charging',
      'technology': 'Li-ion',
      'temperature': 7777777777777777,
      'vendor': 'Google',
      'voltageMinDesign': 1000000000.1001,
      'voltageNow': 1234567890.123456,
    };
    const chrome = {
      os: {
        telemetry: {
          getBatteryInfo: () => expectedBatteryInfo,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getBatteryInfo().then((batteryInfo) => {
      expect(batteryInfo).toEqual(expectedBatteryInfo);
      done();
    });
  });

  test('dpsl.telemetry.getStatefulPartitionInfo() returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedStatefulPartitionInfo = {
          'availableSpace': 80000000000,
          'totalSpace': 90000000000,
        };
        const chrome = {
          os: {
            telemetry: {
              getStatefulPartitionInfo: () => expectedStatefulPartitionInfo,
            },
          },
        };
        global.chrome = chrome;

        dpsl.telemetry.getStatefulPartitionInfo()
            .then((statefulPartitionInfo) => {
              expect(statefulPartitionInfo)
                  .toEqual(expectedStatefulPartitionInfo);
              done();
            });
      });

  test('dpsl.telemetry.getTpmInfo() returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedTpmInfo = {
          'version': {
            'gscVersion': 'cr50',
            'family': 2,
            'specLevel': 1,
            'manufacturer': 42,
            'tpmModel': 3,
            'firmwareVersion': 1,
            'vendorSpecific': 'VendorSpecific',
          },
          'status': {
            'enabled': false,
            'owned': false,
            'ownerPasswordIsPresent': false,
          },
          'dictionaryAttack': {
            'counter': 1,
            'threshold': 2,
            'lockoutInEffect': true,
            'lockoutSecondsRemaining': 50,
          },
        };
        const chrome = {
          os: {
            telemetry: {
              getTpmInfo: () => expectedTpmInfo,
            },
          },
        };
        global.chrome = chrome;

        dpsl.telemetry.getTpmInfo()
            .then((tpmInfo) => {
              expect(tpmInfo)
                  .toEqual(expectedTpmInfo);
              done();
            });
      });

  test('dpsl.telemetry.getOsVersionInfo() returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedOsVersionInfo = {
          'releaseMilestone': '87',
          'buildNumber': '13544',
          'patchNumber': '59.0',
          'releaseChannel': 'stable-channel',
        };
        const chrome = {
          os: {
            telemetry: {
              getOsVersionInfo: () => expectedOsVersionInfo,
            },
          },
        };
        global.chrome = chrome;

        dpsl.telemetry.getOsVersionInfo()
            .then((osVersionInfo) => {
              expect(osVersionInfo)
                  .toEqual(expectedOsVersionInfo);
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
          routines: ['ac_power', 'battery_capacity', 'battery_charge',
            'battery_discharge', 'battery_health', 'cpu_cache',
            'cpu_stress', 'memory', 'disk-read', 'dns_provider_present',
            'dns_resolution', 'gateway_can_be_pinged', 'smartctl-check',
            'signal_strength', 'nvme-wear-level', 'nvme_self_test'],
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
      'dpslRoutineFunction': dpsl.diagnostics.power.runAcPowerRoutine,
      'chromeOsRoutineFunction': 'runAcPowerRoutine',
    },
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
      'dpslRoutineFunction':
        dpsl.diagnostics.cpu.runFloatingPointAccuracyRoutine,
      'chromeOsRoutineFunction': 'runCpuFloatingPointAccuracyRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.cpu.runPrimeSearchRoutine,
      'chromeOsRoutineFunction': 'runCpuPrimeSearchRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.memory.runMemoryRoutine,
      'chromeOsRoutineFunction': 'runMemoryRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.disk.runReadRoutine,
      'chromeOsRoutineFunction': 'runDiskReadRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.nvme.runSmartctlCheckRoutine,
      'chromeOsRoutineFunction': 'runSmartctlCheckRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.nvme.runSelfTestRoutine,
      'chromeOsRoutineFunction': 'runNvmeSelfTestRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.nvme.runWearLevelRoutine,
      'chromeOsRoutineFunction': 'runNvmeWearLevelRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network
          .runDnsProviderPresentRoutine,
      'chromeOsRoutineFunction': 'runDnsProviderPresentRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network
          .runDnsResolutionRoutine,
      'chromeOsRoutineFunction': 'runDnsResolutionRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network
          .runGatewayCanBePingedRoutine,
      'chromeOsRoutineFunction': 'runGatewayCanBePingedRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network.runLanConnectivityRoutine,
      'chromeOsRoutineFunction': 'runLanConnectivityRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network.runSignalStrengthRoutine,
      'chromeOsRoutineFunction': 'runSignalStrengthRoutine',
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
