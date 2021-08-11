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

/**
 * @fileoverview
 *
 * Telemetry interface exposed to third-parties for getting device telemetry
 * information.
 */

/**
 * DPSL Telemetry Requester used in dpsl.telemetry.*.
 */
export default class DPSLTelemetryRequester {
  /**
   * Requests Backlight info.
   * @return { !Promise<!dpsl.BacklightInfo> }
   * @public
   */
  async getBacklightInfo() {
    throw new Error('Not implemented!');
  }

  /**
   * Requests Battery info.
   * @return { !Promise<!dpsl.BatteryInfo> }
   * @public
   */
  async getBatteryInfo() {
    throw new Error('Not implemented!');
  }

  /**
   * Requests Bluetooth info.
   * @return { !Promise<!dpsl.BluetoothInfo> }
   * @public
   */
  async getBluetoothInfo() {
    throw new Error('Not implemented!');
  }

  /**
   * Requests CachedVpd info.
   * @return { !Promise<!dpsl.VpdInfo> }
   * @public
   */
  async getVpdInfo() {
    return chrome.os.telemetry.getVpdInfo();
  }

  /**
   * Requests OEM data info.
   * @return { !Promise<!dpsl.OemDataInfo> }
   * @public
   */
  async getOemData() {
    return chrome.os.telemetry.getOemData();
  }

  /**
   * Requests CPU info.
   * @return { !Promise<!dpsl.CpuInfo> }
   * @public
   */
  async getCpuInfo() {
    throw new Error('Not implemented!');
  }

  /**
   * Requests Fan info.
   * @return { !Promise<!dpsl.FanInfo> }
   * @public
   */
  async getFanInfo() {
    throw new Error('Not implemented!');
  }

  /**
   * Requests Memory info.
   * @return { !Promise<!dpsl.MemoryInfo> }
   * @public
   */
  async getMemoryInfo() {
    throw new Error('Not implemented!');
  }

  /**
   * Requests NonRemovableBlockDevice info.
   * @return { !Promise<!dpsl.BlockDeviceInfo> }
   * @public
   */
  async getNonRemovableBlockDevicesInfo() {
    throw new Error('Not implemented!');
  }

  /**
   * Requests StatefulPartition info.
   * @return { !Promise<!dpsl.StatefulPartitionInfo> }
   * @public
   */
  async getStatefulPartitionInfo() {
    throw new Error('Not implemented!');
  }

  /**
   * Requests Timezone info.
   * @return { !Promise<!dpsl.TimezoneInfo> }
   * @public
   */
  async getTimezoneInfo() {
    throw new Error('Not implemented!');
  }
}
