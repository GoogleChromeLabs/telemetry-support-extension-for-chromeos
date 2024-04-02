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
const statusCodeUtils = require('../status_codes.js');

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

  test('dpsl.telemetry.getAudioInfo() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedAudioInfo = {
      'outputMute': false,
      'inputMute': 'true',
      'underruns': 0,
      'severeUnderruns': 0,
      'outputNodes': [],
      'inputNodes': [],
    };
    const chrome = {
      os: {
        telemetry: {
          getAudioInfo: () => expectedAudioInfo,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getAudioInfo().then((audioInfo) => {
      expect(audioInfo).toEqual(expectedAudioInfo);
      done();
    });
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
          ],
        };

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

  test('dpsl.telemetry.getMarketingInfo() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedMarketingInfo = {
      'marketingName': 'MyMarketingName',
    };
    const chrome = {
      os: {
        telemetry: {
          getMarketingInfo: () => expectedMarketingInfo,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getMarketingInfo().then((marketingInfo) => {
      expect(marketingInfo).toEqual(expectedMarketingInfo);
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

  test('dpsl.telemetry.getUsbBusInfo() returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedUsbBusInfo = {
          'devices': [{
            'classId': 1,
            'subClassId': 2,
            'protocolId': 3,
            'vendorId': 4,
            'productId': 5,
            'interfaces': [{
              'interfaceNumber': 6,
              'classId': 7,
              'subclassId': 8,
              'protocolId': 9,
              'driver': 'TestDriver',
            }],
            'fwupdFirmwareVersionInfo': {
              'version': 'TestVersion',
              'version_format': 'quad',
            },
            'version': 'usb2',
            'spec_speed': 'n5Gbps',
          }],
        };
        const chrome = {
          os: {
            telemetry: {
              getUsbBusInfo: () => expectedUsbBusInfo,
            },
          },
        };
        global.chrome = chrome;

        dpsl.telemetry.getUsbBusInfo()
            .then((usbBusInfo) => {
              expect(usbBusInfo)
                  .toEqual(expectedUsbBusInfo);
              done();
            });
      });

  test('dpsl.telemetry.getDisplayInfo() returns correct data',
      (done) => {
        // Mock the global chrome object.
        const expectedDisplayInfo = {
          'embeddedDisplay': {
            'privacyScreenSupported': true,
            'privacyScreenEnabled': true,
            'displayWidth': 1,
            'displayHeight': 2,
            'resolutionHorizontal': 3,
            'resolutionVertical': 4,
            'refreshRate': 5,
            'manufacturer': 'ABC',
            'modelId': 6,
            'serialNumber': 7,
            'manufactureWeek': 8,
            'manufactureYear': 9,
            'edidVersion': 'TestEdidVersion',
            'inputType': 'digital',
            'displayName': 'TestDisplayName',
          },
          'externalDisplays': [{
            'displayWidth': 1,
            'displayHeight': 2,
            'resolutionHorizontal': 3,
            'resolutionVertical': 4,
            'refreshRate': 5,
            'manufacturer': 'ABC',
            'modelId': 6,
            'serialNumber': 7,
            'manufactureWeek': 8,
            'manufactureYear': 9,
            'edidVersion': 'TestEdidVersion',
            'inputType': 'digital',
            'displayName': 'TestDisplayName',
          }],
        };
        const chrome = {
          os: {
            telemetry: {
              getDisplayInfo: () => expectedDisplayInfo,
            },
          },
        };
        global.chrome = chrome;

        dpsl.telemetry.getDisplayInfo()
            .then((displayInfo) => {
              expect(displayInfo)
                  .toEqual(expectedDisplayInfo);
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
            'signal_strength', 'nvme_self_test',
            'sensitive_sensor', 'fingerprint_alive', 'emmc_lifetime',
            'smartctl_check_with_percentage_used', 'audio_driver',
            'ufs_lifetime', 'power_button'],
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
        const expectedRunRoutineResponse = {
          id: 123456,
          getStatusCode: statusCodeUtils.getStatusCodeForBatteryCapacity,
        };
        const expectedRoutineStatusResponse = {
          progress_percent: 76,
          status: 'running',
          status_message: 'routine is running..',
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

  test('Routine.getStatus() returns correct data when routine returns passed',
      (done) => {
        // Mock the global chrome object.
        const expectedRunRoutineResponse = {
          id: 123456,
          getStatusCode: statusCodeUtils.getStatusCodeForSmartctlCheck,
        };
        const expectedRoutineStatusResponseFromChrome = {
          progress_percent: 100,
          status: 'passed',
          status_message: 'smartctl-check status: PASS.',
        };

        const chrome = {
          os: {
            diagnostics: {
              runSmartctlCheckRoutine:
              () => Promise.resolve(expectedRunRoutineResponse),
              getRoutineUpdate:
              () => Promise.resolve(expectedRoutineStatusResponseFromChrome),
            },
          },
        };
        global.chrome = chrome;

        dpsl.diagnostics.nvme.runSmartctlCheckRoutine().then((routine) => {
          expect(routine).toEqual(expectedRunRoutineResponse);
          routine.getStatus().then((value) => {
            expect(value).toStrictEqual(
                Object.assign(
                    {},
                    expectedRoutineStatusResponseFromChrome,
                    {status_code: 0x0000001},
                ));
            done();
          });
        });
      });

  test('Routine.getStatus() returns correct data when routine returns failed',
      (done) => {
      // Mock the global chrome object.
        const expectedRunRoutineResponse = {
          id: 123456,
          getStatusCode: statusCodeUtils.getStatusCodeForAudioDriver,
        };
        const expectedRoutineStatusResponseFromChrome = {
          progress_percent: 100,
          status: 'failed',
          status_message: '',
          output: '{"audio_devices_succeed_to_open":false,' +
          '"internal_card_detected":true}',
        };

        const chrome = {
          os: {
            diagnostics: {
              runAudioDriverRoutine:
              () => Promise.resolve(expectedRunRoutineResponse),
              getRoutineUpdate:
              () => Promise.resolve(expectedRoutineStatusResponseFromChrome),
            },
          },
        };
        global.chrome = chrome;

        dpsl.diagnostics.audio.runAudioDriverRoutine().then((routine) => {
          expect(routine).toEqual(expectedRunRoutineResponse);
          routine.getStatus().then((value) => {
            expect(value).toStrictEqual(
                Object.assign(
                    {},
                    expectedRoutineStatusResponseFromChrome,
                    {status_code: 0x0060002},
                ));
            done();
          });
        });
      });

  test('Routine.getStatus() returns correct data when routine returns error',
      (done) => {
        // Mock the global chrome object.
        const expectedRunRoutineResponse = {
          id: 123456,
          getStatusCode: statusCodeUtils.getStatusCodeForEmmcLifetime,
        };
        const expectedRoutineStatusResponseFromChrome = {
          progress_percent: 100,
          status: 'error',
          status_message: 'Pre-EOL info is not normal.',
        };

        const chrome = {
          os: {
            diagnostics: {
              runEmmcLifetimeRoutine:
              () => Promise.resolve(expectedRunRoutineResponse),
              getRoutineUpdate:
              () => Promise.resolve(expectedRoutineStatusResponseFromChrome),
            },
          },
        };
        global.chrome = chrome;

        dpsl.diagnostics.emmc.runEmmcLifetimeRoutine().then((routine) => {
          expect(routine).toEqual(expectedRunRoutineResponse);
          routine.getStatus().then((value) => {
            expect(value).toStrictEqual(
                Object.assign(
                    {},
                    expectedRoutineStatusResponseFromChrome,
                    {status_code: 0x0160001},
                ));
            done();
          });
        });
      });

  test('Routine.getStatus() returns correct data when routine returns error ' +
    'with dynamic status message',
  (done) => {
    // Mock the global chrome object.
    const expectedRunRoutineResponse = {
      id: 123456,
      getStatusCode: statusCodeUtils.getStatusCodeForFan,
    };
    const expectedRoutineStatusResponseFromChrome = {
      progress_percent: 100,
      status: 'error',
      status_message: 'Failed to read temperature for thermal sensor idx: 13',
    };

    const chrome = {
      os: {
        diagnostics: {
          runFanRoutine:
              () => Promise.resolve(expectedRunRoutineResponse),
          getRoutineUpdate:
              () => Promise.resolve(expectedRoutineStatusResponseFromChrome),
        },
      },
    };
    global.chrome = chrome;

    dpsl.diagnostics.fan.runFanRoutine().then((routine) => {
      expect(routine).toEqual(expectedRunRoutineResponse);
      routine.getStatus().then((value) => {
        expect(value).toStrictEqual(
            Object.assign(
                {},
                expectedRoutineStatusResponseFromChrome,
                {status_code: 0x0000002},
            ));
        done();
      });
    });
  });

  const testCases = [
    {
      'dpslRoutineFunction': dpsl.diagnostics.power.runAcPowerRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForAcPower,
      'chromeOsRoutineFunction': 'runAcPowerRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.battery.runCapacityRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForBatteryCapacity,
      'chromeOsRoutineFunction': 'runBatteryCapacityRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.battery.runHealthRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForBatteryHealth,
      'chromeOsRoutineFunction': 'runBatteryHealthRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.battery.runDischargeRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForBatteryDischarge,
      'chromeOsRoutineFunction': 'runBatteryDischargeRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.battery.runChargeRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForBatteryCharge,
      'chromeOsRoutineFunction': 'runBatteryChargeRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.cpu.runCacheRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForCpuCache,
      'chromeOsRoutineFunction': 'runCpuCacheRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.cpu.runStressRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForCpuStress,
      'chromeOsRoutineFunction': 'runCpuStressRoutine',
    },
    {
      'dpslRoutineFunction':
        dpsl.diagnostics.cpu.runFloatingPointAccuracyRoutine,
      'getStatusCodeFunc':
        statusCodeUtils.getStatusCodeForFloatingPointAccuracy,
      'chromeOsRoutineFunction': 'runCpuFloatingPointAccuracyRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.cpu.runPrimeSearchRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForPrimeSearch,
      'chromeOsRoutineFunction': 'runCpuPrimeSearchRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.memory.runMemoryRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForMemory,
      'chromeOsRoutineFunction': 'runMemoryRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.disk.runReadRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForDiskRead,
      'chromeOsRoutineFunction': 'runDiskReadRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.emmc.runEmmcLifetimeRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForEmmcLifetime,
      'chromeOsRoutineFunction': 'runEmmcLifetimeRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.nvme.runSmartctlCheckRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForSmartctlCheck,
      'chromeOsRoutineFunction': 'runSmartctlCheckRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.nvme.runSelfTestRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForNvmeSelfTest,
      'chromeOsRoutineFunction': 'runNvmeSelfTestRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.ufs.runUfsLifetimeRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForUfsLifeTime,
      'chromeOsRoutineFunction': 'runUfsLifetimeRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network
          .runDnsResolverPresentRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForDnsResolverPresent,
      'chromeOsRoutineFunction': 'runDnsResolverPresentRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network
          .runDnsResolutionRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForDnsResolution,
      'chromeOsRoutineFunction': 'runDnsResolutionRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network
          .runGatewayCanBePingedRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForGatewayCanBePinged,
      'chromeOsRoutineFunction': 'runGatewayCanBePingedRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network.runLanConnectivityRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForLanConnectivity,
      'chromeOsRoutineFunction': 'runLanConnectivityRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.network.runSignalStrengthRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForSignalStrength,
      'chromeOsRoutineFunction': 'runSignalStrengthRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.sensor.runSensitiveSensorRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForSensitiveSensor,
      'chromeOsRoutineFunction': 'runSensitiveSensorRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.sensor.runFingerprintAliveRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForFingerprintAlive,
      'chromeOsRoutineFunction': 'runFingerprintAliveRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.audio.runAudioDriverRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForAudioDriver,
      'chromeOsRoutineFunction': 'runAudioDriverRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.hardwareButton
          .runPowerButtonRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForPowerButton,
      'chromeOsRoutineFunction': 'runPowerButtonRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.bluetooth
          .runBluetoothPowerRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForBluetoothPower,
      'chromeOsRoutineFunction': 'runBluetoothPowerRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.bluetooth
          .runBluetoothDiscoveryRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForBluetoothDiscovery,
      'chromeOsRoutineFunction': 'runBluetoothDiscoveryRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.bluetooth
          .runBluetoothScanningRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForBluetoothScanning,
      'chromeOsRoutineFunction': 'runBluetoothScanningRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.bluetooth
          .runBluetoothPairingRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForBluetoothPairing,
      'chromeOsRoutineFunction': 'runBluetoothPairingRoutine',
    },
    {
      'dpslRoutineFunction': dpsl.diagnostics.fan.runFanRoutine,
      'getStatusCodeFunc': statusCodeUtils.getStatusCodeForFan,
      'chromeOsRoutineFunction': 'runFanRoutine',
    },
  ];

  testCases.forEach((testCase) => {
    test(`${testCase.dpslRoutineFunction}() returns correct data`, (done) => {
      // Mock the global chrome object.
      const expectedRunRoutineResponse = {
        id: 123456,
        getStatusCode: testCase.getStatusCodeFunc,
      };
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


  test('runSmartctlCheckRoutine works without parameters', (done) => {
    const expectedRunRoutineResponse = {
      id: 123456,
      getStatusCode: statusCodeUtils.getStatusCodeForSmartctlCheck,
    };
    const chrome = {
      os: {
        diagnostics: {
          runSmartctlCheckRoutine:
            (params = undefined) => {
              return Promise.resolve(params === undefined ?
                expectedRunRoutineResponse : undefined);
            },
        },
      },
    };
    global.chrome = chrome;

    dpsl.diagnostics.nvme.runSmartctlCheckRoutine().then((routine) => {
      expect(routine).toEqual(expectedRunRoutineResponse);
      done();
    });
  });

  test('runSmartctlCheckRoutine works with parameters', (done) => {
    const expectedRunRoutineResponse = {
      id: 123456,
      getStatusCode: statusCodeUtils.getStatusCodeForSmartctlCheck,
    };
    const chrome = {
      os: {
        diagnostics: {
          runSmartctlCheckRoutine:
            (params = undefined) =>
              Promise.resolve(params ? expectedRunRoutineResponse : undefined),
        },
      },
    };
    global.chrome = chrome;

    dpsl.diagnostics.nvme
        .runSmartctlCheckRoutine({percentage_used_threshold: 42})
        .then((routine) => {
          expect(routine).toEqual(expectedRunRoutineResponse);
          done();
        });
  });
});
