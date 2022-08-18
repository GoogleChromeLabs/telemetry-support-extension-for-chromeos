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

/* eslint-disable */

/**
 * @fileoverview
 * dpsl.* types definitions.
 */

 ////////////////////// dpsl.telemetry.* type definitions //////////////////////

/**
 * Response message containing Backlight Info
 * @typedef {!Array<{
 *   path: string,
 *   maxBrightness: number,
 *   brightness: number,
 * }>}
 */
dpsl.BacklightInfo;

/**
 * Response message containing Battery Info
 * @typedef {{
 *   cycleCount: number,
 *   voltageNow: number,
 *   vendor: string,
 *   serialNumber: string,
 *   chargeFullDesign: number,
 *   chargeFull: number,
 *   voltageMinDesign: number,
 *   modelName: string,
 *   chargeNow: number,
 *   currentNow: number,
 *   technology: string,
 *   status: string,
 *   manufactureDate: string,
 *   temperature: number
 * }}
 */
dpsl.BatteryInfo;

/**
 * Response message containing Bluetooth Info
 * @typedef {!Array<{
 *   name: string,
 *   address: string,
 *   powered: boolean,
 *   numConnectedDevices: number
 * }>}
 */
dpsl.BluetoothInfo;

/**
 * Response message containing VPD Info
 * @typedef {{
 *   skuNumber: string,
 *   serialNumber: string,
 *   modelName: string,
 *   activateDate: string
 * }}
 */
dpsl.VpdInfo;

/**
 * Response message containing OEM data Info
 * @typedef {{
 *   oemData: string
 * }}
 */
dpsl.OemDataInfo;

/**
 * Response message containing OS version Info
 * @typedef {{
 *   releaseMilestone: !string,
 *   buildNumber: !string,
 *   patchNumber: !string,
 *   releaseChannel: !string
 * }}
 */
dpsl.OsVersionInfo;

/**
 * Response message containing CPU Info
 * @typedef {{
 *   numTotalThreads: number,
 *   architecture: string,
 *   physicalCpus: Array<{
 *     modelName: string,
 *     logicalCpus: Array<{
 *       maxClockSpeedKhz: number,
 *       scalingMaxFrequencyKhz: number,
 *       scalingCurrentFrequencyKhz: number,
 *       idleTimeMs: number,
 *       cStates: Array<{
 *         name: string,
 *         timeInStateSinceLastBootUs: number
 *       }>
 *     }>
 *   }>
 * }}
 */
dpsl.CpuInfo;

/**
 * Response message containing Fan Info
 * @typedef {!Array<{
 *   speedRpm: number
 * }>}
 */
dpsl.FanInfo;

/**
 * Response message containing Memory Info
 * @typedef {{
 *   totalMemoryKiB: number,
 *   freeMemoryKiB: number,
 *   availableMemoryKiB: number,
 *   pageFaultsSinceLastBoot: number
 * }}
 */
dpsl.MemoryInfo;

/**
 * Response message containing BlockDevice Info
 * @typedef {!Array<{
 *   name: !string,
 *   type: !string,
 *   size: !number,
 * }>}
 */
dpsl.BlockDeviceInfo;

/**
 * Response message containing StatefulPartition Info
 * @typedef {{
 *   availableSpace: number,
 *   totalSpace: number
 * }}
 */
dpsl.StatefulPartitionInfo;

/**
 * Response message containing Timezone Info
 * @typedef {{
 *   posix: string,
 *   region: string
 * }}
 */
dpsl.TimezoneInfo;

/**
 * Union of the Telemetry Info types.
 * @typedef {(!dpsl.BacklightInfo|!dpsl.BatteryInfo|!dpsl.BluetoothInfo|
 *   !dpsl.VpdInfo|!dpsl.CpuInfo|!dpsl.FanInfo|!dpsl.MemoryInfo|
 *   !dpsl.BlockDeviceInfo|!dpsl.StatefulPartitionInfo|!dpsl.TimezoneInfo
 * )}
 */
dpsl.TelemetryInfoTypes;

///////////////////// dpsl.diagnostics.* type definitions //////////////////////

/**
 * List of available diagnostics routines (tests). Possible values: [
 * 'battery_capacity', 'battery_charge', 'battery_discharge', 'battery_health',
 * 'cpu_cache', 'cpu_stress', 'memory']
 * @typedef {{
 *    routines: !Array<!string>
 * }}
 */
dpsl.AvailableRoutinesList;

/**
 * |progressPercent| percentage of the routine progress.
 * |output| accumulated output, like logs.
 * |status| current status of the routine. One of ['ready', 'running',
 *   'waiting_user_action', 'passed', 'failed', 'error', 'cancelled',
 *   'failed_to_start', 'removed', 'cancelling', 'unsupported', 'not_run']
 * |statusMessage| more detailed status message.
 * |userMessage| Requested user action. Should be localized and displayed to the
 * user. Note: used in interactive routines only, two possible values are
 * returned: 'unplug-ac-power' or 'plug-in-ac-power'.
 * @typedef {{
 *   progressPercent: !number,
 *   output?: string,
 *   status: !string,
 *   statusMessage: !string,
 *   userMessage?: string
  }}
 */
dpsl.RoutineStatus;

/**
 * Params object of dpsl.diagnostics.power.runAcPowerRoutine()
 * @typedef {{
 *   expectedStatus: !string,
 *   expectedPowerType?: !string
 * }}
 */
dpsl.AcPowerRoutineParams;

/**
 * Params object of dpsl.diagnostics.battery.runChargeRoutine()
 * @typedef {{
 *   lengthSeconds: !number,
 *   minimumChargePercentRequired: !number
 * }}
 */
dpsl.BatteryChargeRoutineParams;

/**
 * Params object of dpsl.diagnostics.battery.runDischargeRoutine()
 * @typedef {{
 *   lengthSeconds: !number,
 *   maximumDischargePercentAllowed: !number
 * }}
 */
dpsl.BatteryDischargeRoutineParams;

/**
 * Params object of dpsl.diagnostics.cpu.{runCacheRoutine(), runStressRoutine(),
 * runFloatingPointAccuracyRoutine()}
 * @typedef {{lengthSeconds: !number}}
 */
dpsl.CpuRoutineDurationParams;

/**
 * Params object of dpsl.diagnostics.disk.runReadRoutine()
 * @typedef {{
 *  type: !string,
 *  lengthSeconds: !number,
 *  fileSizeMb: !number
 * }}
 */
 dpsl.DiskReadRoutineParams;

/**
 * Params object of dpsl.diagnostics.nvme.runWearLevelRoutine()
 * @typedef {{wearLevelThreshold: !number}}
 */
 dpsl.NvmeWearLevelRoutineParams;
