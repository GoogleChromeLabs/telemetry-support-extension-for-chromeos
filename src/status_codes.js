/**
 * Copyright 2024 Google Inc. All rights reserved.
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
* Utils for mapping status messages used in HealthD to status codes by routine.
*/

const CODE_ROUTINE_PASSED = 0x0000001;
const CODE_ROUTINE_EXCEPTION = 0x0000002;

/**
  * Fill `status_code` in RoutineStatus if possible.
  * @param {!function} getStatusCodeFunc
  * @param {!dpsl.RoutineStatus} routineStatus
  * @return { !dpsl.RoutineStatus }
  */
function fillStatusCode(getStatusCodeFunc, routineStatus) {
  switch (routineStatus.status) {
    case 'passed':
      routineStatus.status_code = CODE_ROUTINE_PASSED;
      break;
    case 'failed':
    case 'error':
      routineStatus.status_code = getStatusCodeFunc(routineStatus);
      break;
    default:
      break;
  }
  return routineStatus;
}

/**
  * Get status code based on the specified status message for routine "AC
  * Power".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForAcPower(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Expected online power supply, found offline power supply.':
      return 0x0010001;
    case 'Expected offline power supply, found online power supply.':
      return 0x0010002;
    case 'Read power type different from expected power type.':
      return 0x0010003;
    case 'No valid AC power supply found.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
  * Get status code based on the specified status message for routine "Audio
  * Driver".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForAudioDriver(routineStatus) {
  // As a v2 routine, AudioDrive routine doesn't provide status messages when
  // failed. Manually fill it in.
  if (routineStatus.output) {
    const output = JSON.parse(routineStatus.output);
    if (!output.internal_card_detected) {
      return 0x0060001;
    }
    if (!output.audio_devices_succeed_to_open) {
      return 0x0060002;
    }
  }
  // Exception handlers.
  if (/^Failed to get detected internal card from cras: \d+$/.test(
      routineStatus.statusMessage)) {
    return CODE_ROUTINE_EXCEPTION;
  }
  if (/^Failed retrieving node info from cras: \d+$/.test(
      routineStatus.statusMessage)) {
    return CODE_ROUTINE_EXCEPTION;
  }
  return undefined;
}

/**
  * Get status code based on the specified status message for routine "Battery
  * Capacity".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForBatteryCapacity(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Battery design capacity not within given limits.':
      return 0x0070001;
    case 'Invalid BatteryCapacityRoutineParameters.':
    case 'Failed to get power supply properties from powerd.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
  * Get status code based on the specified status message for routine "Battery
  * Charge".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForBatteryCharge(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Battery is not charging.':
      return 0x0080001;
    case 'Battery charge percent less than minimum required charge percent.':
      return 0x0080002;
    case 'Invalid minimum required charge percent requested.':
    case 'Failed to read battery attributes from sysfs.':
    case 'Failed to get power supply properties from powerd.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
  * Get status code based on the specified status message for routine "Battery
  * Discharge".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForBatteryDischarge(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Battery is not discharging.':
      return 0x0090001;
    case 'Battery discharge rate greater than maximum allowed discharge rate.':
      return 0x0090002;
    case 'Maximum allowed discharge percent must be less than or equal to 100.':
    case 'Failed to read battery attributes from sysfs.':
    case 'Failed to get power supply properties from powerd.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
  * Get status code based on the specified status message for routine "Battery
  * Health".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForBatteryHealth(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Battery is over-worn.':
      return 0x00A0001;
    case 'Battery cycle count is too high.':
      return 0x00A0002;
    case 'Could not get cycle count.':
    case 'Invalid battery health routine parameters.':
    case 'Could not get wear percentage.':
    case 'Failed to get power supply properties from powerd.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
  * Get status code based on the specified status message for routine "Bluetooth
  * Discovery".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForBluetoothDiscovery(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Bluetooth routine failed to validate adapter discovering status.':
      return 0x00B0001;
    case 'Bluetooth routine failed to get main adapter.':
      return 0x00B0002;
    case 'Bluetooth routine failed to change adapter powered status.':
      return 0x00B0003;
    case 'Bluetooth routine failed to switch adapter discovery mode.':
      return 0x00B0004;
    case 'Unexpected Bluetooth diagnostic flow.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
  * Get status code based on the specified status message for routine "Bluetooth
  * Pairing".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForBluetoothPairing(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Bluetooth routine failed to find the device with peripheral ID.':
      return 0x00C0001;
    case 'Bluetooth routine failed to create baseband connection.':
      return 0x00C0002;
    case 'Bluetooth routine failed to finish pairing.':
      return 0x00C0003;
    case 'Bluetooth routine failed to get main adapter.':
      return 0x00C0004;
    case 'Bluetooth routine failed to change adapter powered status.':
      return 0x00C0005;
    case 'Bluetooth routine failed to switch adapter discovery mode.':
      return 0x00C0006;
    case 'Bluetooth routine failed to remove target peripheral.':
      return 0x00C0007;
    case 'The target peripheral is already paired':
      return 0x00C0008;
    case 'Bluetooth routine failed to set target device\'s alias':
    case 'Unexpected Bluetooth diagnostic flow.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
  * Get status code based on the specified status message for routine "Bluetooth
  * Power".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForBluetoothPower(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Bluetooth routine is not supported when adapter is in discovery ' +
      'mode.':
      return 0x00D0001;
    case 'Bluetooth routine failed to get main adapter.':
      return 0x00D0002;
    case 'Bluetooth routine failed to change adapter powered status.':
      return 0x00D0003;
    case 'Bluetooth routine failed to validate adapter powered status.':
      return 0x00D0004;
    case 'Unexpected Bluetooth diagnostic flow.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
  * Get status code based on the specified status message for routine "Bluetooth
  * Scanning".
  * @param {!function} routineStatus
  * @return {number?}
  */
function getStatusCodeForBluetoothScanning(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Bluetooth routine failed to change adapter powered status.':
      return 0x00E0001;
    case 'Bluetooth routine failed to switch adapter discovery mode.':
      return 0x00E0002;
    case 'Bluetooth routine failed to get main adapter.':
      return 0x00E0003;
    case 'Routine execution time should be strictly greater than zero.':
    case 'Unexpected Bluetooth diagnostic flow.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}


/**
 * Get status code based on the specified status message for routine "CPU
 * Cache".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForCpuCache(routineStatus) {
  // As a v2 routine, CpuCache routine doesn't provide status messages when
  // failed. Manually fill it in.
  if (routineStatus.status === 'failed') {
    routineStatus.status_message = 'One or more subtests failed.';
    return 0x0100001;
  }
  switch (routineStatus.status_message) {
    case 'Memory info not found':
    case 'Not enough memory to run stressapptest':
    case 'process control disconnected before routine finished':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "CPU
 * Stress".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForCpuStress(routineStatus) {
  // As a v2 routine, CpuStress routine doesn't provide status messages when
  // failed. Manually fill it in.
  if (routineStatus.status === 'failed') {
    routineStatus.status_message = 'One or more subtests failed.';
    return 0x0110001;
  }
  switch (routineStatus.status_message) {
    case 'Memory info not found':
    case 'Not enough memory to run stressapptest':
    case 'process control disconnected before routine finished':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Disk
 * Read".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForDiskRead(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Disk read duration should not be zero after rounding towards zero ' +
      'to the nearest second':
    case 'Test file size should not be zero':
    case 'Unexpected disk read type':
    case 'Unexpected flow in disk read routine':
    case 'Failed to clean up storage':
    case 'Failed to retrieve free storage space':
    case 'Failed to reserve sufficient storage space':
    case 'Failed to complete fio prepare job':
    case 'Failed to complete fio read job':
    case 'Failed to access fio stderr':
    case 'Failed to read fio stderr':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "DNS
 * Resolution".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForDnsResolution(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Failed to resolve host.':
      return 0x0140001;
    case 'DNS resolution routine did not run.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "DNS
 * Resolver Present".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForDnsResolverPresent(routineStatus) {
  switch (routineStatus.status_message) {
    case 'IP config has no list of name servers available.':
      return 0x0150001;
    case 'IP config has a list of at least one malformed name server.':
      return 0x0150002;
    case 'DNS resolver present routine did not run.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Emmc
 * Lifetime".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForEmmcLifetime(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Pre-EOL info is not normal.':
      return 0x0160001;
    case 'Debugd returns error.':
    case 'Failed to parse mmc output.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Fan".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForFan(routineStatus) {
  // As a v2 routine, Fan routine doesn't provide status messages when
  // failed. Manually fill it in.
  if (routineStatus.status === 'failed') {
    routineStatus.status_message = 'One or more fans cannot be set to certain' +
      ' speed.';
    return 0x0170001;
  }
  switch (routineStatus.status_message) {
    case 'cros config fan count must be a valid number':
    case 'routine unsupported for device with no fan':
    case 'Invalid routine stage':
    case 'Failed to get number of fans':
    case 'Failed to read fan speed':
    case 'Failed to set fan speed':
    case 'Failed to read thermal sensor version':
    case 'Error initializing udev':
      return CODE_ROUTINE_EXCEPTION;
    // Dynamic status message is handled by regex below in default.
    // "Failed to read temperature for thermal sensor idx: X"
    default:
      if (/^Failed to read temperature for thermal sensor idx: \d+$/.test(
          routineStatus.status_message)) {
        return CODE_ROUTINE_EXCEPTION;
      }
      return undefined;
  }
}


/**
 * Get status code based on the specified status message for routine
 * "Fingerprint Alive".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForFingerprintAlive(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Failed to get fingerprint info.':
      return 0x0190001;
    case 'Fingerprint does not use a RW firmware copy.':
      return 0x0190002;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Floating
 * Point Accuracy".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForFloatingPointAccuracy(routineStatus) {
  switch (routineStatus.status_message) {
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Gateway
 * can be Pinged".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForGatewayCanBePinged(routineStatus) {
  switch (routineStatus.status_message) {
    case 'All gateways are unreachable, hence cannot be pinged.':
      return 0x01B0001;
    case 'The default network cannot be pinged.':
      return 0x01B0002;
    case 'The default network has a latency above the threshold.':
      return 0x01B0003;
    case 'One or more of the non-default networks has failed pings.':
      return 0x01B0004;
    case 'One or more of the non-default networks has a latency above the ' +
      'threshold.':
      return 0x01B0005;
    case 'Gateway can be pinged routine did not run.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "LAN
 * Connectivity".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForLanConnectivity(routineStatus) {
  switch (routineStatus.status_message) {
    case 'No LAN Connectivity detected.':
      return 0x0200001;
    case 'LAN Connectivity routine did not run.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Memory".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForMemory(routineStatus) {
  // As a v2 routine, Memory routine doesn't provide status messages when
  // failed. Manually fill it in.
  if (routineStatus.status === 'failed') {
    routineStatus.status_message = 'One or more subtests failed.';
    return 0x0220001;
  }
  switch (routineStatus.status_message) {
    case 'Memory info not found':
    case 'Less than 4 KiB memory available, not enough to run memtester.':
    case 'Error in calling memtester':
    case 'Error allocating or locking memory, or invoking the memtester binary':
    case 'Error parsing memtester output':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "NVMe Self
 * Test".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForNvmeSelfTest(routineStatus) {
  switch (routineStatus.status_message) {
    case 'SelfTest status: self-test failed to start.':
      return 0x0230001;
    case 'SelfTest status: Operation was aborted by Device Self-test command.':
      return 0x0230002;
    case 'SelfTest status: Operation was aborted by a Controller Level Reset.':
      return 0x0230003;
    case 'SelfTest status: Operation was aborted due to a removal of a ' +
      'namespace from the namespace inventory.':
      return 0x0230004;
    case 'SelfTest Status: Operation was aborted due to the processing of a ' +
      'Format NVM command.':
      return 0x0230005;
    case 'SelfTest status: A fatal error or unknown test error occurred ' +
      'while the controller was executing the device self-test operation ' +
      'and the operation did not complete.':
      return 0x0230006;
    case 'SelfTest status: Operation completed with a segment that failed ' +
      'and the segment that failed is not known.':
      return 0x0230007;
    case 'SelfTest status: Operation completed with one or more failed ' +
      'segments and the first segment that failed is indicated in the ' +
      'Segment Number field.':
      return 0x0230008;
    case 'SelfTest status: Operation was aborted for an unknown reason.':
      return 0x0230009;
    case 'SelfTest status: ERROR, self-test abortion failed.':
    case 'SelfTest status: Unknown complete status.':
    case 'SelfTest status: ERROR, cannot get percent info.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "NVMe Wear
 * Level".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForNvmeWearLevel(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Wear-level status: FAILED, exceed the limitation value.':
      return 0x0240001;
    case 'Wear-level status: ERROR, threshold in percentage should be ' +
      'non-empty and under 100.':
    case 'Wear-level status: ERROR, cannot get wear level info.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Power
 * Button".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForPowerButton(routineStatus) {
  switch (routineStatus.status_message) {
    // Dynamic status message is handled by regex below.
    // "Timeout is not in range [%u, %u]"
    case 'Routine failed. No power button event observed.':
      return 0x0250001;
    case 'Routine error. Unable to listen for power button events.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      if (/^Timeout is not in range \[\d+, \d+\]$/.test(
          routineStatus.status_message)) {
        return CODE_ROUTINE_EXCEPTION;
      }
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Prime
 * Search".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForPrimeSearch(routineStatus) {
  switch (routineStatus.status_message) {
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Sensitive
 * Sensor".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForSensitiveSensor(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Sensitive sensor routine failed to pass all sensors.':
      return 0x0280001;
    case 'Sensitive sensor routine failed to pass configuration check.':
      return 0x0280002;
    case 'Sensitive sensor routine failed unexpectedly.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Signal
 * Strength".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForSignalStrength(routineStatus) {
  switch (routineStatus.status_message) {
    case 'Weak signal detected.':
      return 0x0290001;
    case 'Signal strength routine did not run.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "Smartctl
 * Check".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForSmartctlCheck(routineStatus) {
  switch (routineStatus.status_message) {
    case 'smartctl-check status: FAILED, one or more checks have failed.':
      return 0x02A0001;
    case 'smartctl-check status: ERROR, threshold in percentage should be ' +
      'non-empty and between 0 and 255, inclusive.':
    case 'smartctl-check status: ERROR, debugd returns error.':
    case 'smartctl-check status: FAILED, unable to parse smartctl output.':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

/**
 * Get status code based on the specified status message for routine "UFS Life
 * Time".
 * @param {!function} routineStatus
 * @return {number?}
 */
function getStatusCodeForUfsLifeTime(routineStatus) {
  // As a v2 routine, UFS routine doesn't provide status messages when failed.
  // Manually fill it in.
  if (routineStatus.status === 'failed') {
    routineStatus.status_message = 'Pre-EOL info is not normal.';
    return 0x02B0001;
  }
  switch (routineStatus.status_message) {
    case 'Unable to determine a bsg node path':
    case 'Unable to deduce health descriptor path based on the bsg node path':
    case 'Error reading content from UFS health descriptor':
      return CODE_ROUTINE_EXCEPTION;
    default:
      return undefined;
  }
}

module.exports = {
  fillStatusCode,
  getStatusCodeForAcPower,
  getStatusCodeForAudioDriver,
  getStatusCodeForBatteryCapacity,
  getStatusCodeForBatteryCharge,
  getStatusCodeForBatteryDischarge,
  getStatusCodeForBatteryHealth,
  getStatusCodeForBluetoothDiscovery,
  getStatusCodeForBluetoothPairing,
  getStatusCodeForBluetoothPower,
  getStatusCodeForBluetoothScanning,
  getStatusCodeForCpuCache,
  getStatusCodeForCpuStress,
  getStatusCodeForDiskRead,
  getStatusCodeForDnsResolution,
  getStatusCodeForDnsResolverPresent,
  getStatusCodeForEmmcLifetime,
  getStatusCodeForFan,
  getStatusCodeForFingerprintAlive,
  getStatusCodeForFloatingPointAccuracy,
  getStatusCodeForGatewayCanBePinged,
  getStatusCodeForLanConnectivity,
  getStatusCodeForMemory,
  getStatusCodeForNvmeSelfTest,
  getStatusCodeForNvmeWearLevel,
  getStatusCodeForPowerButton,
  getStatusCodeForPrimeSearch,
  getStatusCodeForSensitiveSensor,
  getStatusCodeForSignalStrength,
  getStatusCodeForSmartctlCheck,
  getStatusCodeForUfsLifeTime,
};
