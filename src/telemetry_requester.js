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
 * Telemetry interface exposed to third-parties for getting device telemetry
 * information.
 */

const API_NAME = 'telemetry';

/**
 * DPSL Telemetry Requester used in dpsl.telemetry.*.
 */
class DPSLTelemetryRequester {
  /**
   * Requests CachedVpd info.
   * @return { !Promise<!dpsl.VpdInfo> }
   * @public
   */
  async getVpdInfo() {
    const functionName = 'getVpdInfo';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.telemetry.getVpdInfo();
  }

  /**
   * Requests OEM data info.
   * @return { !Promise<!dpsl.OemDataInfo> }
   * @public
   */
  async getOemData() {
    const functionName = 'getOemData';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 96);
    }

    return chrome.os.telemetry.getOemData();
  }

  /**
   * Requests CPU info.
   * @return { !Promise<!dpsl.CpuInfo> }
   * @public
   */
  async getCpuInfo() {
    const functionName = 'getCpuInfo';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 99);
    }

    return chrome.os.telemetry.getCpuInfo();
  }

  /**
   * Requests Memory info.
   * @return { !Promise<!dpsl.MemoryInfo> }
   * @public
   */
  async getMemoryInfo() {
    const functionName = 'getMemoryInfo';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 99);
    }

    return chrome.os.telemetry.getMemoryInfo();
  }

  /**
   * Requests non removable block devices info.
   * @return { !Promise<!dpsl.BlockDeviceInfo> }
   * @public
   */
  async getNonRemovableBlockDevicesInfo() {
    const functionName = 'getNonRemovableBlockDevicesInfo';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 108);
    }

    return chrome.os.telemetry.getNonRemovableBlockDevicesInfo();
  }

  /**
   * Requests Battery info.
   * @return { !Promise<!dpsl.BatteryInfo> }
   * @public
   */
  async getBatteryInfo() {
    const functionName = 'getBatteryInfo';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 102);
    }

    return chrome.os.telemetry.getBatteryInfo();
  }

  /**
   * Requests Stateful Partition info.
   * @return { !Promise<!dpsl.StatefulPartitionInfo> }
   * @public
   */
  async getStatefulPartitionInfo() {
    const functionName = 'getStatefulPartitionInfo';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 105);
    }

    return chrome.os.telemetry.getStatefulPartitionInfo();
  }

  /**
   * Requests OS version info.
   * @return { !Promise<!dpsl.OsVersionInfo> }
   * @public
   */
  async getOsVersionInfo() {
    const functionName = 'getOsVersionInfo';
    if (!isSupported(functionName)) {
      throw new MethodNotFoundError(API_NAME, functionName,
          /* chromeVersion */ 105);
    }

    return chrome.os.telemetry.getOsVersionInfo();
  }
}

module.exports = {
  DPSLTelemetryRequester: DPSLTelemetryRequester,
};
