/**
 * Copyright 2022 Google Inc. All rights reserved.
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
 * Utils file that exposes helpful methods.
 */


/**
   * Returns true if a |functionName| exists in the chrome.os.telemetry or
   * chrome.os.diagnostics APIs. Returns false otherwise.
   * @param {!string} functionName
   * @return { !boolean }
   */
function isSupported(functionName) {
    const foundInTelemetry = (chrome.os && chrome.os.telemetry &&
        chrome.os.telemetry[functionName] &&
        (typeof chrome.os.telemetry[functionName] === 'function'));

    const foundInDiagnostics = (chrome.os && chrome.os.diagnostics &&
        chrome.os.diagnostics[functionName] &&
        (typeof chrome.os.diagnostics[functionName] === 'function'));

    return foundInTelemetry || foundInDiagnostics;
}
  
/**
  * Custom DPSL error that is thrown if an API function is not supported.
  * @param {!string} apiName either 'telemetry' or 'diagnostics'
  * @param {!string} functionName the expected function name in |apiName|.
  * @param {!number} chromeVersion the minimum chrome version that the
  * |functionName| is supported in.
  */
class MethodNotFoundError extends Error {
    /**
      * @constructor
      */
    constructor(apiName, functionName, chromeVersion) {
        super('chrome.os.' + apiName + '.' + functionName + '() is not found' +
        '. Consider updating Google Chrome to M' + chromeVersion + '.');
        this.name = 'DPSL_MethodNotFoundError';
    }
}

module.exports = {
    isSupported: isSupported,
    MethodNotFoundError: MethodNotFoundError,
};
  