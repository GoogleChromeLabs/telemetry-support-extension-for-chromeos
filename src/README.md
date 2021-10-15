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

## Functions
### dpsl.telemetry.*
| Function Name | Definition |
------------ | -------------
| getVpdInfo | () => Promise\<VpdInfo\> |
| getOemData | () => Promise\<OemDataInfo\> |

### dpsl.diagnostics.*
| Function Name | Definition |
------------ | ------------- |
| getAvailableRoutines | () => Promise\<List\<string\>\> |

### dpsl.diagnostics.battery.*
| Function Name | Definition |
------------ | ------------- |
| runCapacityRoutine | () => Promise\<Routine\> |
| runHealthRoutine | () => Promise\<Routine\> |
| runDischargeRoutine | (params: BatteryDischargeRoutineParams) => Promise\<Routine\> |
| runChargeRoutine | (params: BatteryChargeRoutineParams) => Promise\<Routine\> |

### dpsl.diagnostics.cpu.*
| Function Name | Definition |
------------ | ------------- |
| runCacheRoutine | (params: CpuRoutineDurationParams) => Promise\<Routine\> |
| runStressRoutine | (params: CpuRoutineDurationParams) => Promise\<Routine\> |

### dpsl.diagnostics.memory.*
| Function Name | Definition |
------------ | ------------- |
| runMemoryRoutine | () => Promise\<Routine\> |
