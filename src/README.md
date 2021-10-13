# NOTE#1
The files in this directory (including this README.md) is a subset of [DPSL doc](https://source.chromium.org/chromium/chromium/src/+/main:chromeos/components/telemetry_extension_ui/resources/dpsl/).

# Note#2
You may refer to [cros-diag-app/diagnostics-extension](https://github.com/MahmoudAGawad/cros-diag-app/tree/main/diagnostics-extension) to see the integration of this library in action.

# Overview
Diagnostic Processor Support Library (DPSL) is a collection of telemetry and
diagnostics interfaces exposed to third-parties. All API functions are
accessed through the dpsl.* namespace:
   - dpsl.diagnostics
    | Diagnostics interface for running device diagnostics routines (tests).
   - dpsl.telemetry
    | Telemetry (a.k.a. Probe) interface for getting device telemetry
    | information.

# Supported APIs/Functions
Currently, the following is supported:
- dpsl.telemetry:
-- dpsl.telemetry.getVpdInfo(): Promise<dpsl.VpdInfo>     // see types.js
-- dpsl.telemetry.getOemData(): Promise<dpsl.OemDataInfo>
- dpsl.diagnostics:
-- dpsl.diagnostics.getAvailableRoutines(): Promise<dpsl.AvailableRoutinesList>
-- dpsl.diagnostics.battery.runCapacityRoutine(): Promise<Routine>
-- dpsl.diagnostics.battery.runHealthRoutine(): Promise<Routine>
-- dpsl.diagnostics.battery.runDischargeRoutine(params: dpsl.BatteryDischargeRoutineParams): Promise<Routine>
-- dpsl.diagnostics.battery.runChargeRoutine(params: dpsl.BatteryChargeRoutineParams): Promise<Routine>
-- dpsl.diagnostics.cpu.runCacheRoutine(params: dpsl.CpuRoutineDurationParams): Promise<Routine>
-- dpsl.diagnostics.cpu.runStressRoutine(params: dpsl.CpuRoutineDurationParams): Promise<Routine>
-- dpsl.diagnostics.memory.runMemoryRoutine(): Promise<Routine>

## Dealing with diagnostic routines
Routine object is returned from run*Routine() functions. It stores the
routine's id and exposes useful operations. Below is the interface:

class Routine {
  constructor(id)
  // Queries the status of the routine.
  getStatus(): Promise<dpsl.RoutineStatus>
  // Used for interactive diagnostic routines. Typically routines that
  // wait user input.
  resume(): Promise<dpsl.RoutineStatus>
  // Stops and removes the routine from the system.
  stop(): Promise<dpsl.RoutineStatus>
}

dpsl.RoutineStatus is documented in types.js.

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