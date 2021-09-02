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

/**
* @fileoverview
*
* Diagnostics interface exposed to third-parties for running device diagnostics
* routines (tests).
*/

/**
 * @type {!string}
 * @const
 * @private
 */
const ROUTINE_STATUS_WAITING_USER_ACTION = 'waiting';

/**
 * Keeps track of Routine status when running dpsl.diagnostics.* diagnostics
 * routines.
 */
class Routine {
  /**
   * @param {!number} id
   * @private
   */
  constructor(id) {
    /**
     * Routine ID created when the routine is first requested to run.
     * @type { !number }
     * @const
     * @private
     */
    this.id = id;
  }

  /**
   * Sends |command| on this routine to the backend.
   * @param {!string} command
   * @returns {!Promise<!dpsl.RoutineStatus>}
   * @private
   */
  async _genericSendCommand(command) {
    const message =
          /** @type {!dpsl_internal.DiagnosticsGetRoutineUpdateRequest} */ ({
        routineId: this.id,
        command: command,
        includeOutput: true
      });
    const response =
      /**
        @type {{
        progressPercent: number,
        output: string,
        routineUpdateUnion: ({interactiveUpdate: {userMessage:
        string}}|{noninteractiveUpdate:{status: string, statusMessage:
        string}})
        }}
      */
      (await genericSendMessage(
        dpsl_internal.Message.DIAGNOSTICS_ROUTINE_UPDATE, message));

    let status = /** @type {dpsl.RoutineStatus} */ ({
      progressPercent: 0,
      output: '',
      status: '',
      statusMessage: '',
      userMessage: ''
    });

    // fill in the status object and return it.
    status.progressPercent = response.progressPercent;
    status.output = response.output || '';
    if (response.routineUpdateUnion.noninteractiveUpdate) {
      status.status = response.routineUpdateUnion.noninteractiveUpdate.status;
      status.statusMessage =
        response.routineUpdateUnion.noninteractiveUpdate.statusMessage;
    } else {
      status.userMessage =
        response.routineUpdateUnion.interactiveUpdate.userMessage;
      status.status = ROUTINE_STATUS_WAITING_USER_ACTION;
    }
    return status;
  }

  /**
   * Returns current status of this routine.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async getStatus() {
    return this._genericSendCommand('get-status');
  }

  /**
   * Resumes this routine, e.g. when user prompts to run a waiting routine.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async resume() {
    return this._genericSendCommand('continue');
  }

  /**
   * Stops this routine, if running, or remove otherwise.
   * Note: The routine cannot be restarted again.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async stop() {
    this._genericSendCommand('cancel');
    return this._genericSendCommand('remove');
  }
}

const routineMap = {
  BATTERY_RUN_CAPACITY_ROUTINE: chrome.os.diagnostics.runBatteryCapcityRoutine
};

/**
 * @param {!routineToRun} Promise<!RunRoutineResponse>
 * @param {!args} Object
 * @returns {!Promise<!Routine>}
 */
async function genericRunRoutine(routineToRun, args) {
  const response = await routineToRun(args);
  return new Routine(response.id);
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
    return genericRunRoutine(routineMap[BATTERY_RUN_CAPACITY_ROUTINE]);
  }

  /**
   * Runs battery health test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runHealthRoutine() {
    throw new Error('Not implemented!');
  }

  /**
   * Runs battery capacity test.
   * @param {!dpsl.BatteryDischargeRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runDischargeRoutine(params) {
    throw new Error('Not implemented!');
  }

  /**
   * Runs battery charge test.
   * @param {!dpsl.BatteryChargeRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runChargeRoutine(params) {
    throw new Error('Not implemented!');
  }
}

/**
 * Diagnostics NVME Manager for dpsl.diagnostics.nmve.* APIs.
 */
class NvmeManager {
  /**
   * Runs NVMe smartctl test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runSmartctlCheckRoutine() {
    throw new Error('Not implemented!');
  }

  /**
   * Runs NVMe wear level test.
   * @param {!dpsl.NvmeWearLevelRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runWearLevelRoutine(params) {
    throw new Error('Not implemented!');
  }

  /**
   * Runs NVMe short-self-test type test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runShortSelfTestRoutine() {
    throw new Error('Not implemented!');
  }

  /**
   * Runs NVMe long-self-test type test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runLongSelfTestRoutine() {
    throw new Error('Not implemented!');
  }
}

/**
 * Diagnostics Power Manager for dpsl.diagnostics.power.* APIs.
 */
class PowerManager {
  /**
   * Runs power ac connected-type test.
   * @param {(!dpsl.PowerAcRoutineParams)=} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runAcConnectedRoutine(params) {
    throw new Error('Not implemented!');
  }

  /**
   * Runs power ac disconnected-type test.
   * @param {(!dpsl.PowerAcRoutineParams)=} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runAcDisconnectedRoutine(params) {
    throw new Error('Not implemented!');
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
    throw new Error('Not implemented!');
  }

  /**
   * Runs CPU stress test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runStressRoutine(params) {
    throw new Error('Not implemented!');
  }

  /**
   * Runs CPU floating point accuracy test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runFloatingPointAccuracyRoutine(params) {
    throw new Error('Not implemented!');
  }

  /**
   * Runs CPU prime number search test.
   * @param {!dpsl.CpuPrimeSearchRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runPrimeSearchRoutine(params) {
    throw new Error('Not implemented!');
  }
}


/**
 * Diagnostics Disk Manager for dpsl.diagnostics.disk.* APIs.
 */
class DiskManager {
  /**
   * Runs disk linear read test.
   * @param {!dpsl.DiskReadRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runLinearReadRoutine(params) {
    throw new Error('Not implemented!');
  }

  /**
   * Runs disk random read test.
   * @param {!dpsl.DiskReadRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runRandomReadRoutine(params) {
    throw new Error('Not implemented!');
  }
}

/**
 * DPSL Diagnostics Manager for dpsl.diagnostics.* APIs.
 */
export default class DPSLDiagnosticsManager {
  constructor() {
    /**
     * @type {!BatteryManager}
     * @public
     */
    this.battery = new BatteryManager();

    /**
     * @type {!NvmeManager}
     * @public
     */
    this.nvme = new NvmeManager();

    /**
     * @type {!PowerManager}
     * @public
     */
    this.power = new PowerManager();

    /**
     * @type {!CpuManager}
     * @public
     */
    this.cpu = new CpuManager();

    /**
     * @type {!DiskManager}
     * @public
     */
    this.disk = new DiskManager();
  }
}
