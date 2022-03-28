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
   * Returns true if a |functionName| exists in the chrome.os.telemetry API.
   * Returns false otherwise.
   * @param {!string} functionName
   * @return { !boolean }
   */
function isSupported(functionName) {
  return chrome.os && chrome.os.telemetry &&
      chrome.os.telemetry[functionName] &&
      (typeof chrome.os.telemetry[functionName] === 'function');
}

/**
   * Returns a meaningful error message if a |functionName| doesn't exist in
   * the chrome.os.telemetry API.
   * @param {!string} functionName
   * @return { !string }
   */
function getErrorMessage(functionName) {
  return 'DPSL: chrome.os.telemetry.' + functionName + '() is not found.' +
    ' Consider updating Google Chrome.';
}


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
      return Promise.reject(new Error(getErrorMessage(functionName)));
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
      return Promise.reject(new Error(getErrorMessage(functionName)));
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
      return Promise.reject(new Error(getErrorMessage(functionName)));
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
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.telemetry.getMemoryInfo();
  }

  /**
   * Requests Battery info.
   * @return { !Promise<!dpsl.BatteryInfo> }
   * @public
   */
  async getBatteryInfo() {
    return chrome.os.telemetry.getBatteryInfo();
  }
}

module.exports = {
  DPSLTelemetryRequester: DPSLTelemetryRequester,
};
