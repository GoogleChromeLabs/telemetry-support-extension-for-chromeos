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
 * Response message containing Audio input node Info
 * @typedef {!{
*   outputMute: boolean,
*   inputMute: boolean,
*   underruns: number,
*   severeUnderruns: number,
*   outputNodes: Array<{
*      id: number,
*      name: string,
*      deviceName: string,
*      active: boolean,
*      nodeVolume: number,
*   }>,
*  inputNodes: Array<{
*      id: number,
*      name: string,
*      deviceName: string,
*      active: boolean,
*      nodeGain: number,
*   }>,
* }}
*/
dpsl.AudioInfo;

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
 * Response message containing internet 
 * connectivity info
 * @typedef {{
 *   networks: Array<{
 *     type: string,
 *     state: string,
 *     macAddress: string,
 *     ipv4Address: string,
 *     ipv6Addresses: Array<string>,
 *     signalStrength: number
 *   }>
 * }}
 */
dpsl.InternetConnectivityInfo;

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
*   marketingName: string,
* }}
*/
dpsl.MarketingInfo;

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
 * Response message containing TPM Info
 * @typedef {{
 *   version: {
 *     gscVersion: string,
 *     family: number,
 *     specLevel: number,
 *     manufacturer: number,
 *     modelNumber: number,
 *     tpmModel: number,
 *     firmwareVersion: number,
 *     vendorSpecific: string,
 *   },
 *   status: {
 *     enabled: boolean,
 *     owned: boolean,
 *     ownerPasswordIsPresent: boolean,
 *   },
 *   dictionaryAttack: {
 *     counter: number,
 *     threshold: number,
 *     lockoutInEffect: number,
 *     lockoutSecondsRemaining: number,
 *   },
 * }}
 */
dpsl.TpmInfo;

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

/**
 * Response message containing USB bus Info
 * @typedef {{
*   devices: Array<{
*     classId: number,
*     subClassId: number,
*     protocolId: number,
*     vendorId: number,
*     productId: number,
*     interfaces: Array<{
*       interfaceNumber: number,
*       classId: number,
*       subclassId: number,
*       protocolId: number,
*       driver: string,
*     }>,
*     fwupdFirmwareVersionInfo: {
*       version: string,
*       version_format: string
*     }
*     version: string,
*     spec_speed: string
*   }>
* }}
*/
dpsl.UsbBusInfo;

/**
 * Response message containing Display Info
 * @typedef {{
 *   embeddedDisplay: {
 *     privacyScreenSupported: boolean,
 *     privacyScreenEnabled: boolean,
 *     displayWidth: number,
 *     displayHeight: number,
 *     resolutionHorizontal: number,
 *     resolutionVertical: number,
 *     refreshRate: number,
 *     manufacturer: string,
 *     modelId: number,
 *     serialNumber: number,
 *     manufactureWeek: number,
 *     manufactureYear: number,
 *     edidVersion: string,
 *     inputType: string,
 *     displayName: string,
 *   },
 *   externalDisplays: Array<{
 *     displayWidth: number,
 *     displayHeight: number,
 *     resolutionHorizontal: number,
 *     resolutionVertical: number,
 *     refreshRate: number,
 *     manufacturer: string,
 *     modelId: number,
 *     serialNumber: number,
 *     manufactureWeek: number,
 *     manufactureYear: number,
 *     edidVersion: string,
 *     inputType: string,
 *     displayName: string,
 *   }>,
 * }}
 */
dpsl.DisplayInfo;

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
 *   user. Note: used in interactive routines only, possible values are
 *   'unplug_ac_power', 'plug_in_ac_power' and 'press_power_button'.
 * @typedef {{
 *   progress_percent: !number,
 *   output?: string,
 *   status: !string,
 *   status_message: !string,
 *   user_message?: string
  }}
 */
dpsl.RoutineStatus;

/**
 * Params object of dpsl.diagnostics.power.runAcPowerRoutine()
 * @typedef {{
 *   expected_status: !string,
 *   expected_power_type?: !string
 * }}
 */
dpsl.AcPowerRoutineParams;

/**
 * Params object of dpsl.diagnostics.battery.runChargeRoutine()
 * @typedef {{
 *   length_seconds: !number,
 *   minimum_charge_percent_required: !number
 * }}
 */
dpsl.BatteryChargeRoutineParams;

/**
 * Params object of dpsl.diagnostics.battery.runDischargeRoutine()
 * @typedef {{
 *   length_seconds: !number,
 *   maximum_discharge_percent_allowed: !number
 * }}
 */
dpsl.BatteryDischargeRoutineParams;

/**
 * Params object of dpsl.diagnostics.cpu.{runCacheRoutine(), runStressRoutine(),
 * runFloatingPointAccuracyRoutine()}
 * @typedef {{length_seconds: !number}}
 */
dpsl.CpuRoutineDurationParams;

/**
 * Params object of dpsl.diagnostics.disk.runReadRoutine()
 * @typedef {{
 *  type: !string,
 *  length_seconds: !number,
 *  file_size_mb: !number
 * }}
 */
 dpsl.DiskReadRoutineParams;

/**
* Params object of dpsl.diagnostics.nvme.runSelfTestRoutine()
* Possible test_types are 'short_test' and 'long_test'
* @typedef {{
 *  test_type: !string,
 * }}
 */
dpsl.NvmeSelfTestRoutineParams;

/**
 * Params object of dpsl.diagnostics.nvme.runWearLevelRoutine()
 * @typedef {{wear_level_threshold: !number}}
 */
 dpsl.NvmeWearLevelRoutineParams;

/**
 * Params object of dpsl.diagnostics.nvme.runSmartctlCheckRoutine()
 * @typedef {{percentage_used_threshold: !number}}
 */
 dpsl.SmartctlCheckRoutineParams;

/**
 * Params object of dpsl.diagnostics.hardwareButton.runPowerButtonRoutine()
 * @typedef {{timeout_seconds: !number}}
 */
 dpsl.PowerButtonRoutineParams;
