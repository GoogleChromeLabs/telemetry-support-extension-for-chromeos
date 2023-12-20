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

/* global chrome */

const {isSupported, MethodNotFoundError} = require('./utils.js');

/**
* @fileoverview
*
* Diagnostics interface exposed to third-parties for running device diagnostics
* routines (tests).
*/

const API_NAME = 'diagnostics';
const ROUTINE_COMMAND_TYPE = {
  CANCEL: 'cancel',
  REMOVE: 'remove',
  RESUME: 'resume',
  GET_STATUS: 'status',
};

/**
 * Keeps track of Routine status when running dpsl.diagnostics.* diagnostics
 * routines.
 */
class Routine {
  /**
   * @param {!number} id
   */
  constructor(id) {
    /**
     * Routine ID created when the routine is first requested to run.
     * @type { !number }
     * @const
     */
    this.id = id;
  }

  /**
   * Sends |command| on this routine to the backend.
   * @param {!string} command
   * @return {!Promise<!dpsl.RoutineStatus>}
   * @private
   */
  async _getRoutineUpdate(command) {
    const request = {
      id: this.id,
      command: command,
    };

    return /** @type {!dpsl.RoutineStatus} */ (
      chrome.os.diagnostics.getRoutineUpdate(request));
  }

  /**
   * Returns current status of this routine.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async getStatus() {
    return this._getRoutineUpdate(ROUTINE_COMMAND_TYPE.GET_STATUS);
  }

  /**
   * Resumes this routine, e.g. when user prompts to run a waiting routine.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async resume() {
    return this._getRoutineUpdate(ROUTINE_COMMAND_TYPE.RESUME);
  }

  /**
   * Stops this routine, if running, or remove otherwise.
   * Note: The routine cannot be restarted again.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async stop() {
    this._getRoutineUpdate(ROUTINE_COMMAND_TYPE.CANCEL);
    return this._getRoutineUpdate(ROUTINE_COMMAND_TYPE.REMOVE);
  }
}

/**
 * AC Power Manager for dpsl.diagnostics.power.* APIs.
 */
class AcPowerManager {
  /**
   * Runs AC Power test.
   * @param {!dpsl.AcPowerRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runAcPowerRoutine(params) {
    const functionName = 'runAcPowerRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 105);
    }

    return chrome.os.diagnostics.runAcPowerRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics Battery Manager for dpsl.diagnostics.battery.* APIs.
 */
class BatteryManager {
  /**
   * Runs battery capacity test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runCapacityRoutine() {
    const functionName = 'runBatteryCapacityRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.diagnostics.runBatteryCapacityRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs battery health test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runHealthRoutine() {
    const functionName = 'runBatteryHealthRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.diagnostics.runBatteryHealthRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs battery capacity test.
   * @param {!dpsl.BatteryDischargeRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runDischargeRoutine(params) {
    const functionName = 'runBatteryDischargeRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.diagnostics.runBatteryDischargeRoutine(params).then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs battery charge test.
   * @param {!dpsl.BatteryChargeRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runChargeRoutine(params) {
    const functionName = 'runBatteryChargeRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.diagnostics.runBatteryChargeRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics CPU Manager for dpsl.diagnostics.cpu.* APIs.
 */
class CpuManager {
  /**
   * Runs CPU cache test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runCacheRoutine(params) {
    const functionName = 'runCpuCacheRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.diagnostics.runCpuCacheRoutine(params).then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs CPU stress test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runStressRoutine(params) {
    const functionName = 'runCpuStressRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.diagnostics.runCpuStressRoutine(params).then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs CPU floating point accuracy test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runFloatingPointAccuracyRoutine(params) {
    const functionName = 'runCpuFloatingPointAccuracyRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 99);
    }

    return chrome.os.diagnostics.runCpuFloatingPointAccuracyRoutine(params)
        .then((response) => new Routine(response.id));
  }

  /**
   * Runs CPU prime search test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runPrimeSearchRoutine(params) {
    const functionName = 'runCpuPrimeSearchRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 99);
    }

    return chrome.os.diagnostics.runCpuPrimeSearchRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics Memory Manager for dpsl.diagnostics.memory.* APIs.
 */
class MemoryManager {
  /**
   * Runs memory test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runMemoryRoutine() {
    const functionName = 'runMemoryRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.diagnostics.runMemoryRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics Disk Manager for dpsl.diagnostics.disk.* APIs.
 */
class DiskManager {
  /**
   * Runs disk read test.
   * @param {!dpsl.DiskReadRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runReadRoutine(params) {
    const functionName = 'runDiskReadRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 101);
    }

    return chrome.os.diagnostics.runDiskReadRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics eMMC Manager for dpsl.diagnostics.emmc.* APIs.
 */
class EmmcManager {
  /**
   * Runs eMMC lifetime check. This routine checks the lifetime of the eMMC
   * drive. The routine will pass if PRE_EOL_INFO is 0x01 (normal). In
   * addition, the value of DEVICE_LIFE_TIME_EST_TYP_A and
   * DEVICE_LIFE_TIME_EST_TYP_B will be included in the output.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runEmmcLifetimeRoutine() {
    const functionName = 'runEmmcLifetimeRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 110);
    }

    return chrome.os.diagnostics.runEmmcLifetimeRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics NVMe Manager for dpsl.diagnostics.nmve.* APIs.
 */
class NvmeManager {
  /**
   * Runs NVMe smartctl test.
   * @param {dpsl.SmartctlCheckRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runSmartctlCheckRoutine(params = undefined) {
    const functionName = 'runSmartctlCheckRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 100);
    }

    if (arguments.length != 0) {
      return chrome.os.diagnostics.runSmartctlCheckRoutine(params).then(
          (response) => new Routine(response.id));
    }

    return chrome.os.diagnostics.runSmartctlCheckRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs NVMe self test.
   * @param {!dpsl.NvmeSelfTestRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runSelfTestRoutine(params) {
    const functionName = 'runNvmeSelfTestRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 110);
    }

    return chrome.os.diagnostics.runNvmeSelfTestRoutine(params).then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs NVMe wear level test.
   * @param {!dpsl.NvmeWearLevelRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runWearLevelRoutine(params) {
    const functionName = 'runNvmeWearLevelRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 100);
    }

    return chrome.os.diagnostics.runNvmeWearLevelRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics UFS Manager for dpsl.diagnostics.ufs.* APIs.
 */
class UfsManager {
  /**
   * Runs UFS lifetime check. This routine checks the lifetime of the UFS
   * drive.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runUfsLifetimeRoutine() {
    const functionName = 'runUfsLifetimeRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 117);
    }

    return chrome.os.diagnostics.runUfsLifetimeRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics Network Manager for dpsl.diagnostics.network.* APIs.
 */
class NetworkManager {
  /**
   * Runs a test that checks if the DNS provider is present.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runDnsResolverPresentRoutine() {
    const functionName = 'runDnsResolverPresentRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 108);
    }

    return chrome.os.diagnostics.runDnsResolverPresentRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs a test that checks if DNS resolution is successful.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runDnsResolutionRoutine() {
    const functionName = 'runDnsResolutionRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 108);
    }

    return chrome.os.diagnostics.runDnsResolutionRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs a test that checks if the network gateway can be pinged.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runGatewayCanBePingedRoutine() {
    const functionName = 'runGatewayCanBePingedRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 108);
    }

    return chrome.os.diagnostics.runGatewayCanBePingedRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs Network Lan connectivity test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runLanConnectivityRoutine() {
    const functionName = 'runLanConnectivityRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 102);
    }

    return chrome.os.diagnostics.runLanConnectivityRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs Signal Strength test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runSignalStrengthRoutine() {
    const functionName = 'runSignalStrengthRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 108);
    }

    return chrome.os.diagnostics.runSignalStrengthRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * Sensor Manager for dpsl.diagnostics.sensor.* APIs.
 */
class SensorManager {
  /**
   * Runs sensitive sensor test. This routine checks that the device's sensors
   * are working correctly by monitoring the sensor sample data without user
   * interaction. This routine only support sensitive sensors including
   * accelerometers, gyro sensors, gravity sensors and magnetometers.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runSensitiveSensorRoutine() {
    const functionName = 'runSensitiveSensorRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 110);
    }

    return chrome.os.diagnostics.runSensitiveSensorRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs fingerprint alive sensor test. This routine checks whether the
   * fingerprint module is alive or not. Alive means the sensor is responsive
   * and the firmware version is RW.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runFingerprintAliveRoutine() {
    const functionName = 'runFingerprintAliveRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 110);
    }

    return chrome.os.diagnostics.runFingerprintAliveRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics audio Manager for dpsl.diagnostics.audio.* APIs.
 */
class AudioManager {
  /**
   * Runs audio driver check. This routine checks whether there is any errors
   * about the audio driver.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runAudioDriverRoutine() {
    const functionName = 'runAudioDriverRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 117);
    }

    return chrome.os.diagnostics.runAudioDriverRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics Hardware Button Manager for dpsl.diagnostics.hardwareButton.*
 * APIs.
 */
class HardwareButtonManager {
  /**
   * Runs power button test. This routine checks the functionality of the power
   * button. The routine passes if a power button event is received before the
   * timeout. Otherwise, the routine fails.
   * @param {!dpsl.PowerButtonRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runPowerButtonRoutine(params) {
    const functionName = 'runPowerButtonRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 117);
    }

    return chrome.os.diagnostics.runPowerButtonRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics Bluetooth Manager for dpsl.diagnostics.bluetooth.* APIs.
 */
class BluetoothManager {
  /**
   * Runs Bluetooth power check. This routine checks whether the Bluetooth
   * adapter can be powered off/on and the powered status is consistent in both
   * HCI and D-Bus levels.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runBluetoothPowerRoutine() {
    const functionName = 'runBluetoothPowerRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 117);
    }

    return chrome.os.diagnostics.runBluetoothPowerRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs Bluetooth discovery check. This routine checks whether the Bluetooth
   * adapter can start/stop discovery mode and the discovering status is
   * consistent in both HCI and D-Bus levels.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runBluetoothDiscoveryRoutine() {
    const functionName = 'runBluetoothDiscoveryRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 118);
    }

    return chrome.os.diagnostics.runBluetoothDiscoveryRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs Bluetooth scanning check. This routine checks whether the Bluetooth
   * adapter can scan nearby Bluetooth peripherals and collect nearby
   * peripherals' information.
   * @param {!dpsl.BluetoothScanningRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runBluetoothScanningRoutine(params) {
    const functionName = 'runBluetoothScanningRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 118);
    }

    return chrome.os.diagnostics.runBluetoothScanningRoutine(params).then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs Bluetooth pairing check. This routine checks whether the adapter can
   * find and pair with a device with a specific peripheral id.
   * @param {!dpsl.BluetoothPairingRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runBluetoothPairingRoutine(params) {
    const functionName = 'runBluetoothPairingRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 118);
    }

    return chrome.os.diagnostics.runBluetoothPairingRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics fan Manager for dpsl.diagnostics.fan.* APIs.
 */
class FanManager {
  /**
   * Runs fan test. This routine checks whether the fan can be controlled.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runFanRoutine() {
    const functionName = 'runFanRoutine';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 121);
    }

    return chrome.os.diagnostics.runFanRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * DPSL Diagnostics Manager for dpsl.diagnostics.* APIs.
 */
class DPSLDiagnosticsManager {
  /**
   * @constructor
   */
  constructor() {
    /**
     * @type {!AcPowerManager}
     * @public
     */
    this.power = new AcPowerManager();

    /**
     * @type {!BatteryManager}
     * @public
     */
    this.battery = new BatteryManager();

    /**
     * @type {!CpuManager}
     * @public
     */
    this.cpu = new CpuManager();

    /**
     * @type {!MemoryManager}
     * @public
     */
    this.memory = new MemoryManager();

    /**
     * @type {!DiskManager}
     * @public
     */
    this.disk = new DiskManager();

    /**
     * @type {!NvmeManager}
     * @public
     */
    this.nvme = new NvmeManager();

    /**
     * @type {!NetworkManager}
     * @public
     */
    this.network = new NetworkManager();

    /**
     * @type {!SensorManager}
     * @public
     */
    this.sensor = new SensorManager();

    /**
     * @type {!EmmcManager}
     * @public
     */
    this.emmc = new EmmcManager();

    /**
     * @type {!AudioManager}
     * @public
     */
    this.audio = new AudioManager();

    /**
     * @type {!UfsManager}
     * @public
     */
    this.ufs = new UfsManager();

    /**
     * @type {!HardwareButtonManager}
     * @public
     */
    this.hardwareButton = new HardwareButtonManager();

    /**
     * @type {!BluetoothManager}
     * @public
     */
    this.bluetooth = new BluetoothManager();

    /**
     * @type {!FanManager}
     * @public
     */
    this.fan = new FanManager();
  }

  /**
     * Requests a list of available diagnostics routines.
     * @return { !Promise<!dpsl.AvailableRoutinesList> }
     * @public
     */
  async getAvailableRoutines() {
    const functionName = 'getAvailableRoutines';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.diagnostics.getAvailableRoutines();
  }
}

module.exports = {
  DPSLDiagnosticsManager: DPSLDiagnosticsManager,
  Routine: Routine,
};
