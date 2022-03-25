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
class DPSLTelemetryRequester {
  /**
   * Requests CachedVpd info.
   * @return { !Promise<!dpsl.VpdInfo> }
   * @public
   */
  async getVpdInfo() {
    if (!chrome.os || !chrome.os.telemetry
        || !chrome.os.telemetry.getVpdInfo
        || chrome.os.telemetry.getVpdInfo !== 'function') {
      return Promise.reject("DPSL: chrome.os.telemetry.getVpdInfo() is not" + 
        "found. Consider updating Google Chrome.");
    }

    return chrome.os.telemetry.getVpdInfo();
  }

  /**
   * Requests OEM data info.
   * @return { !Promise<!dpsl.OemDataInfo> }
   * @public
   */
  async getOemData() {
    if (!chrome.os || !chrome.os.telemetry
        || !chrome.os.telemetry.getOemData
        || chrome.os.telemetry.getOemData !== 'function') {
      return Promise.reject("DPSL: chrome.os.telemetry.getOemData() is not" + 
        "found. Consider updating Google Chrome.");
    }

    return chrome.os.telemetry.getOemData();
  }

  /**
   * Requests CPU info.
   * @return { !Promise<!dpsl.CpuInfo> }
   * @public
   */
  async getCpuInfo() {
    if (!chrome.os || !chrome.os.telemetry
        || !chrome.os.telemetry.getCpuInfo
        || chrome.os.telemetry.getCpuInfo !== 'function') {
      return Promise.reject("DPSL: chrome.os.telemetry.getCpuInfo() is not" + 
        "found. Consider updating Google Chrome.");
    }

    return chrome.os.telemetry.getCpuInfo();
  }

  /**
   * Requests Memory info.
   * @return { !Promise<!dpsl.MemoryInfo> }
   * @public
   */
  async getMemoryInfo() {
    if (!chrome.os || !chrome.os.telemetry
        || !chrome.os.telemetry.getMemoryInfo
        || chrome.os.telemetry.getMemoryInfo !== 'function') {
      return Promise.reject("DPSL: chrome.os.telemetry.getMemoryInfo() is not" + 
        "found. Consider updating Google Chrome.");
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
