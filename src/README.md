# NOTES
- The files in this directory is a subset of [Chromium's DPSL](https://source.chromium.org/chromium/chromium/src/+/main:chromeos/components/telemetry_extension_ui/resources/dpsl/).

- You may refer to [cros-diag-app/diagnostics-extension](https://github.com/MahmoudAGawad/cros-diag-app/tree/main/diagnostics-extension) to see the integration of this library in action.

# Overview
Diagnostic Processor Support Library (DPSL) is a collection of telemetry and
diagnostics interfaces exposed to third-parties. All API functions are
accessed via the dpsl.* namespace:
   - dpsl.diagnostics
    | Diagnostics interface for running device diagnostics routines (tests).
   - dpsl.telemetry
    | Telemetry (a.k.a. Probe) interface for getting device telemetry
    | information.

# Usage examples

## Telemetry example
```
function fetchVpdInfo() {
  dpsl.telemetry.getVpdInfo().then((vpdInfo) => {
    console.log('Product number:', vpdInfo.skuNumber);
    console.log('Model name:', vpdInfo.modelName);
    // do something
  }).catch((error) => {
    // check error message
    console.error(error.message);
  });
}
// fetch VpdInfo after two seconds.
setTimeout(fetchVpdInfo, 2000);
```

## Diagnostics example
```
// Run CPU stress routine...

function isFinalStatus(routineStatus) {
  return !(['ready', 'running', 'waiting'].includes(routineStatus.status));
}

function checkRoutineStatus(routine, routineStatus) {
  console.log('Routine Progress:', routineStatus.progressPercent);
  if (!isFinalStatus(routineStatus)) {
    setTimeout(() => {
      routine.getStatus().
       then((status) => checkRoutineStatus(routine, status)).
       catch((error) => {
         // do something with the error
         routine.stop();
       });
    }, 200);
    return;
  }
  // do something with the result…

  // do not forget to stop the routine when finished.
  routine.stop();
}

function handleCpuRoutine(routine) {
  /** @type {!Promise<RoutineStatus>} */
  routine.getStatus().then((status) => checkRoutineStatus(routine, status));
}

/** @type {Promise<Array<string>>} */
dpsl.diagnostics.getAvailableRoutines().then((routineList) => {
  if (!routineList.includes('cpu-stress')) return;

  /** @type {Promise<Routine>} */
  dpsl.diagnostics.cpu.runStressRoutine({length_seconds: 2})
    .then(handleCpuRoutine)
    .catch((error) => {
      console.error('Couldn’t run routine: ', error.message);
  });
});
```

# API Summary
## Types
### RoutineStatus
| Property Name | Type | Description |
------------ | ------- | ----------- |
| progressPercent | number | Percentage of the routine progress |
| output* | string | Accumulated output, like logs |
| status | string | Current status of the routine. One of ['ready', 'running', 'waiting_user_action', 'passed', 'failed', 'error', 'cancelled', 'failed_to_start', 'removed', 'cancelling', 'unsupported', 'not_run', 'unknown'] |
| statusMessage | string | More detailed status message |
| userMessage* | string | The requested user action. Note: used in interactive routines only. Possible values ['unplug-ac-power', 'plug-in-ac-power', 'unknown' ]

(*) Optional fields.

### Routine
The `Routine` object is returned from run*Routine() functions. It stores the
routine's id and exposes useful operations.
```
class Routine {
  constructor(id)
  // Queries the status of the routine.
  getStatus(): Promise<RoutineStatus>
  // Used for interactive diagnostic routines. Typically routines that
  // wait user input.
  resume(): Promise<RoutineStatus>
  // Stops and removes the routine from the system.
  stop(): Promise<RoutineStatus>
}
```

#### Important Notes regarding routine's id
- The code (chrome browser extension) that uses the library needs to remember the routine's id so that it can perform operations on it (i.e. Routine.getStatus()) after the service worker is restarted.

- Chrome OS doesn't persist routines across reboots. This means that depending code must not rely on routines created in previous sessions.

- Routine's id usually starts with 0.

### VpdInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| skuNumber | string | Device's SKU number, a.k.a. product number |
| serialNumber | string | Device's serial number |
| modelName | string | Device's model name |
| activateDate | string | Device's activate date: Format: YYYY-WW |

### OemDataInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| oemData | string | OEM's specific data. This field is used to store battery serial number by some OEMs |

### CpuInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| architecture | string | The CPU architecture - it's assumed all of a device's CPUs share the same architecture |
| numTotalThreads | number | Number of total threads available |
| phyiscalCpus | Array<PhyiscalCpuInfo> | Information about the device's physical CPUs |

### PhyiscalCpuInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| logicalCpus | Array<LogicalCpuInfo> | Logical CPUs corresponding to this physical CPU |
| modelName | string | The CPU model name |

### LogicalCpuInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| cStates | Array<CpuCStateInfo> | Information about the logical CPU's time in various C-states |
| idleTimeMs | number | Idle time since last boot, in milliseconds |
| maxClockSpeedKhz | number | The max CPU clock speed in kilohertz |
| scalingCurrentFrequencyKhz | number | Current frequency the CPU is running at |
| scalingMaxFrequencyKhz | number | Maximum frequency the CPU is allowed to run at, by policy |

### CpuCStateInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| name | string | State name |
| timeInStateSinceLastBootUs | number | Time spent in the state since the last reboot, in microseconds |

### InternetConnectivityInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| networks | Array<NetworkInfo> | List of available network interfaces and their configuration |

### NetworkInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| type | string | The type of network interface (wifi, ethernet, etc.) |
| state | string | The current state of the network interface (disabled, enabled, online, etc.) |
| macAddress | string | (Added in M110): The currently assigned mac address. Only available with the permission os.telemetry.network_info. |
| ipv4Address | string | The currently assigned ipv4Address of the interface |
| ipv6Addresses | Array<string> | The list of currently assigned ipv6Addresses of the interface |
| signalStrength | number | The current signal strength in percent |

### MemoryInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| totalMemoryKiB | number | Total memory, in kilobytes |
| freeMemoryKiB | number | Free memory, in kilobytes |
| availableMemoryKiB | number | Available memory, in kilobytes |
| pageFaultsSinceLastBoot | number | Number of page faults since the last boot |

### BatteryInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| chargeFull | number | Full capacity (Ah) |
| chargeFullDesign | number | Design capacity (Ah) |
| chargeNow | number | Battery's charge (Ah) |
| currentNow | number | Battery's current (A) |
| cycleCount | number | Battery's cycle count |
| manufactureDate | string | Manufacturing date in yyyy-mm-dd format. Included when the main battery is Smart |
| modelName | string | Battery's model name |
| serialNumber | string | Battery's serial number |
| status | string | Battery's status (e.g. charging) |
| technology | string | Used technology in the battery |
| temperature | number | Temperature in 0.1K. Included when the main battery is Smart |
| vendor | string | Battery's manufacturer |
| voltageMinDesign | number | Desired minimum output voltage |
| voltageNow | number | Battery's voltage (V) |

### StatefulPartitionInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| availableSpace | number | The currently available space in the user partition (Bytes) |
| totalSpace | number | The total space of the user partition (Bytes) |

### TpmVersion
| Property Name | Type | Description |
------------ | ------- | ----------- |
| gscVersion | string | The version of Google security chip(GSC), or "not_gsc" if not applicable  |
| family | number | TPM family. We use the TPM 2.0 style encoding (see [here](https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-1-Architecture-01.07-2014-03-13.pdf)  for reference), e.g.: <ul><li>TPM 1.2: "1.2" -> 0x312e3200</li><li> TPM 2.0: "2.0" -> 0x322e3000</li></ul> |
| specLevel | number | The level of the specification that is implemented by the TPM  |
| manufacturer | number | A manufacturer specific code |
| tpmModel | number | The TPM model number |
| firmwareVersion | number | The current firmware version of the TPM  |
| vendorSpecific | string | Information set by the vendor |

### TpmStatus
| Property Name | Type | Description |
------------ | ------- | ----------- |
| enabled | boolean | Wheather the |
| owned | boolean | Whether the TPM has been owned |
| specLevel | boolean | Whether the owner password is still retained (as part of the TPM initialization) |

### TpmDictionaryAttack
| Property Name | Type | Description |
------------ | ------- | ----------- |
| counter | number | The current dictionary attack counter value |
| threshold | number | The current dictionary attack counter threshold |
| lockoutInEffect | boolean | Whether the TPM is currently in some form of dictionary attack lockout |
| lockoutSecondsRemaining | number | The number of seconds remaining in the lockout (if applicable) |

### TpmInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| version | TpmVersion | The current version of the Trusted Platform Module (TPM) |
| status | TpmStatus | The current status of the TPM |
| dictonaryAttack | TpmDictionaryAttack | TPM dictionary attack (DA) related information |

### OsVersionInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| releaseMilestone | string | The release milestone (e.g. "87") |
| buildNumber | string | The build number (e.g. "13544") |
| patchNumber | string | The build number (e.g. "59.0") |
| releaseChannel | string | The release channel (e.g. "stable-channel") |

### BlockDeviceInfo
| Property Name | Type | Description |
------------ | ------- | ----------- |
| name | string | The name of the block device. |
| type | string | The type of the block device, (e.g. "MMC", "NVMe" or "ATA"). |
| size | number | The device size in bytes. |

### AcPowerRoutineParams
| Property Name | Type | Description |
------------ | ------- | ----------- |
| expectedStatus | string | The expected status of the AC ('connected', 'disconnected' or 'unknown') |
| expectedPowerType* | string | If specified, this must match the type of power supply for the routine to succeed. |

### BatteryDischargeRoutineParams
| Property Name | Type | Description |
------------ | ------- | ----------- |
| lengthSeconds | number | Length of time to run the routine for |
| maximumDischargePercentAllowed | number | The routine will fail if the battery discharges by more than this percentage |

### BatteryChargeRoutineParams
| Property Name | Type | Description |
------------ | ------- | ----------- |
| lengthSeconds | number | Length of time to run the routine for |
| minimumChargePercentRequired | number | The routine will fail if the battery charges by less than this percentage |

### CpuRoutineDurationParams
| Property Name | Type | Description |
------------ | ------- | ----------- |
| lengthSeconds | number | Length of time to run the routine for |

### NvmeWearLevelRoutineParams
| Property Name | Type | Description |
------------ | ------- | ----------- |
| wearLevelThreshold | number | Threshold number in percentage which routine examines wear level status against |

## Functions
### dpsl.telemetry.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| getVpdInfo | () => Promise\<VpdInfo\> | 1.0.0 |
| getOemData | () => Promise\<OemDataInfo\> | 1.0.0 |
| getCpuInfo | () => Promise\<CpuInfo\> |  1.2.0 |
| getMemoryInfo | () => Promise\<MemoryInfo\> | 1.2.0 |
| getBatteryInfo | () => Promise\<BatteryInfo\> | 1.3.0 |
| getStatefulPartitionInfo | () => Promise\<StatefulPartitionInfo\> | 1.3.1 |
| getOsVersionInfo | () => Promise\<OsVersionInfo\> | 1.3.1 |
| getNonRemovableBlockDevicesInfo | () => Promise\<BlockDeviceInfo\> | 1.3.2 |
| getInternetConnectivityInfo | () => Promise\<InternetConnectivityInfo\> | 1.3.2 |
| getTpmInfo | () => Promise\<TpmInfo\> | 1.3.2 |

### dpsl.diagnostics.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| getAvailableRoutines | () => Promise\<List\<string\>\> | 1.0.0 |

### dpsl.diagnostics.power.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| runAcPowerRoutine | (params: AcPowerRoutineParams) => Promise\<Routine\> | 1.3.1 |

### dpsl.diagnostics.battery.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| runCapacityRoutine | () => Promise\<Routine\> | 1.0.0 |
| runHealthRoutine | () => Promise\<Routine\> | 1.0.0 |
| runDischargeRoutine | (params: BatteryDischargeRoutineParams) => Promise\<Routine\> | 1.0.0 |
| runChargeRoutine | (params: BatteryChargeRoutineParams) => Promise\<Routine\> | 1.0.0 |

### dpsl.diagnostics.cpu.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| runCacheRoutine | (params: CpuRoutineDurationParams) => Promise\<Routine\> | 1.0.0 |
| runStressRoutine | (params: CpuRoutineDurationParams) => Promise\<Routine\> | 1.0.0 |
| runFloatingPointAccuracyRoutine | (params: CpuRoutineDurationParams) => Promise\<Routine\> | 1.1.0 |
| runPrimeSearchRoutine | (params: CpuRoutineDurationParams) => Promise\<Routine\> | 1.1.0 |

### dpsl.diagnostics.memory.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| runMemoryRoutine | () => Promise\<Routine\> | 1.0.0 |

### dpsl.diagnostics.disk.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| runReadRoutine | () => Promise\<Routine\> | 1.3.1 |

### dpsl.diagnostics.nvme.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| runSmartctlCheckRoutine | () => Promise\<Routine\> | 1.3.0 |
| runWearLevelRoutine | (params: NvmeWearLevelRoutineParams) => Promise\<Routine\> | 1.3.0 |
| runSelfTestRoutine | (params: NvmeSelfTestRoutineParams) => Promise\<Routine\> | 1.3.3 |

### dpsl.diagnostics.network.*
| Function Name | Definition | Released in `dpsl` version |
------------ | ------------- | ------------- |
| runLanConnectivityRoutine | () => Promise\<Routine\> | 1.3.0 |
| runSignalStrengthRoutine | () => Promise\<Routine\> | 1.3.2 |
| runDnsProviderPresentRoutine | () => Promise\<Routine\> | 1.3.2 |
| runDnsResolutionRoutine | () => Promise\<Routine\> | 1.3.2 |
| runGatewayCanBePingedRoutine | () => Promise\<Routine\> | 1.3.2 |
