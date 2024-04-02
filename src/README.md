# NOTES
- The files in this directory is a subset of [Chromium's DPSL](https://source.chromium.org/chromium/chromium/src/+/main:chromeos/components/telemetry_extension_ui/resources/dpsl/).

- You may refer to [cros-diag-app/diagnostics-extension](https://github.com/MahmoudAGawad/cros-diag-app/tree/main/diagnostics-extension) to see the integration of this library in action.

# Overview
Diagnostic Processor Support Library (DPSL) is a collection of telemetry and
diagnostics interfaces exposed to third-parties. All API functions are
accessed via the dpsl.* namespace:
   - dpsl.diagnostics
    | Diagnostics interface for running device diagnostics routines (tests).
   - dpsl.telemetry
    | Telemetry (a.k.a. Probe) interface for getting device telemetry
    | information.

# Usage examples

## Telemetry example
```
function fetchVpdInfo() {
  dpsl.telemetry.getVpdInfo().then((vpdInfo) => {
    console.log('Product number:', vpdInfo.skuNumber);
    console.log('Model name:', vpdInfo.modelName);
    // do something
  }).catch((error) => {
    // check error message
    console.error(error.message);
  });
}
// fetch VpdInfo after two seconds.
setTimeout(fetchVpdInfo, 2000);
```

## Diagnostics example
```
// Run CPU stress routine...

function isFinalStatus(routineStatus) {
  return !(['ready', 'running', 'waiting'].includes(routineStatus.status));
}

function checkRoutineStatus(routine, routineStatus) {
  console.log('Routine Progress:', routineStatus.progress_percent);
  if (!isFinalStatus(routineStatus)) {
    setTimeout(() => {
      routine.getStatus().
       then((status) => checkRoutineStatus(routine, status)).
       catch((error) => {
         // do something with the error
         routine.stop();
       });
    }, 200);
    return;
  }
  // do something with the result…

  // do not forget to stop the routine when finished.
  routine.stop();
}

function handleCpuRoutine(routine) {
  /** @type {!Promise<RoutineStatus>} */
  routine.getStatus().then((status) => checkRoutineStatus(routine, status));
}

/** @type {Promise<Array<string>>} */
dpsl.diagnostics.getAvailableRoutines().then((routineList) => {
  if (!routineList.includes('cpu-stress')) return;

  /** @type {Promise<Routine>} */
  dpsl.diagnostics.cpu.runStressRoutine({length_seconds: 2})
    .then(handleCpuRoutine)
    .catch((error) => {
      console.error('Couldn’t run routine: ', error.message);
  });
});
```

# API Summary
## Types
### RoutineStatus
| Property Name    | Type   | Description                                                                                                                                                                                                  |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| progress_percent | number | Percentage of the routine progress                                                                                                                                                                           |
| output*          | string | Accumulated output, like logs                                                                                                                                                                                |
| status           | string | Current status of the routine. One of ['ready', 'running', 'waiting_user_action', 'passed', 'failed', 'error', 'cancelled', 'failed_to_start', 'removed', 'cancelling', 'unsupported', 'not_run', 'unknown'] |
| status_code*     | number | The corresponding code for the status message                                                                                                                                                                |
| status_message   | string | More detailed status message                                                                                                                                                                                 |
| user_message*    | string | The requested user action. Note: used in interactive routines only. Possible values ['unplug_ac_power', 'plug_in_ac_power', 'press_power_button', 'unknown' ]                                                |

(*) Optional fields.

### Routine
The `Routine` object is returned from run*Routine() functions. It stores the
routine's id and exposes useful operations.
```
class Routine {
  constructor(id)
  // Queries the status of the routine.
  getStatus(): Promise<RoutineStatus>
  // Used for interactive diagnostic routines. Typically routines that
  // wait user input.
  resume(): Promise<RoutineStatus>
  // Stops and removes the routine from the system.
  stop(): Promise<RoutineStatus>
}
```

#### Important Notes regarding routine's id
- The code (chrome browser extension) that uses the library needs to remember the routine's id so that it can perform operations on it (i.e. Routine.getStatus()) after the service worker is restarted.

- Chrome OS doesn't persist routines across reboots. This means that depending code must not rely on routines created in previous sessions.

- Routine's id usually starts with 0.

### AudioInfo
| Property Name   | Type                       | Description                             |
| --------------- | -------------------------- | --------------------------------------- |
| outputMute      | boolean                    | Is the active output device mute or not |
| inputMute       | boolean                    | Is the active input device mute or not  |
| underruns       | number                     | Number of underruns                     |
| severeUnderruns | number                     | Number of severe underruns              |
| outputNodes     | Array<AudioOutputNodeInfo> | Output nodes                            |
| inputNodes      | Array<AudioInputNodeInfo>  | Input nodes                             |

### AudioOutputNodeInfo
| Property Name | Type    | Description                                                                                       |
| ------------- | ------- | ------------------------------------------------------------------------------------------------- |
| id            | number  | Node id                                                                                           |
| name          | string  | The name of this node. For example, "Speaker"                                                     |
| deviceName    | string  | The name of the device that this node belongs to. For example, "HDA Intel PCH: CA0132 Analog:0,0" |
| active        | boolean | Whether this node is currently used for output. There is one active node for output               |
| nodeVolume    | number  | The node volume in [0, 100]                                                                       |

### AudioInputNodeInfo
| Property Name | Type    | Description                                                                                       |
| ------------- | ------- | ------------------------------------------------------------------------------------------------- |
| id            | number  | Node id                                                                                           |
| name          | string  | The name of this node. For example, "Internal Mic"                                                |
| deviceName    | string  | The name of the device that this node belongs to. For example, "HDA Intel PCH: CA0132 Analog:0,0" |
| active        | boolean | Whether this node is currently used for input. There is one active node for input                 |
| nodeGain      | number  | The input node gain set by UI, the value is in [0, 100]                                           |

### VpdInfo
| Property Name | Type   | Description                                |
| ------------- | ------ | ------------------------------------------ |
| skuNumber     | string | Device's SKU number, a.k.a. product number |
| serialNumber  | string | Device's serial number                     |
| modelName     | string | Device's model name                        |
| activateDate  | string | Device's activate date: Format: YYYY-WW    |

### OemDataInfo
| Property Name | Type   | Description                                                                         |
| ------------- | ------ | ----------------------------------------------------------------------------------- |
| oemData       | string | OEM's specific data. This field is used to store battery serial number by some OEMs |

### CpuInfo
| Property Name   | Type                   | Description                                                                            |
| --------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| architecture    | string                 | The CPU architecture - it's assumed all of a device's CPUs share the same architecture |
| numTotalThreads | number                 | Number of total threads available                                                      |
| phyiscalCpus    | Array<PhyiscalCpuInfo> | Information about the device's physical CPUs                                           |

### PhyiscalCpuInfo
| Property Name | Type                  | Description                                     |
| ------------- | --------------------- | ----------------------------------------------- |
| logicalCpus   | Array<LogicalCpuInfo> | Logical CPUs corresponding to this physical CPU |
| modelName     | string                | The CPU model name                              |

### LogicalCpuInfo
| Property Name              | Type                 | Description                                                  |
| -------------------------- | -------------------- | ------------------------------------------------------------ |
| cStates                    | Array<CpuCStateInfo> | Information about the logical CPU's time in various C-states |
| idleTimeMs                 | number               | Idle time since last boot, in milliseconds                   |
| maxClockSpeedKhz           | number               | The max CPU clock speed in kilohertz                         |
| scalingCurrentFrequencyKhz | number               | Current frequency the CPU is running at                      |
| scalingMaxFrequencyKhz     | number               | Maximum frequency the CPU is allowed to run at, by policy    |

### CpuCStateInfo
| Property Name              | Type   | Description                                                    |
| -------------------------- | ------ | -------------------------------------------------------------- |
| name                       | string | State name                                                     |
| timeInStateSinceLastBootUs | number | Time spent in the state since the last reboot, in microseconds |

### InternetConnectivityInfo
| Property Name | Type               | Description                                                  |
| ------------- | ------------------ | ------------------------------------------------------------ |
| networks      | Array<NetworkInfo> | List of available network interfaces and their configuration |

### NetworkInfo
| Property Name  | Type          | Description                                                                                                        |
| -------------- | ------------- | ------------------------------------------------------------------------------------------------------------------ |
| type           | string        | The type of network interface (wifi, ethernet, etc.)                                                               |
| state          | string        | The current state of the network interface (disabled, enabled, online, etc.)                                       |
| macAddress     | string        | (Added in M110): The currently assigned mac address. Only available with the permission os.telemetry.network_info. |
| ipv4Address    | string        | The currently assigned ipv4Address of the interface                                                                |
| ipv6Addresses  | Array<string> | The list of currently assigned ipv6Addresses of the interface                                                      |
| signalStrength | number        | The current signal strength in percent                                                                             |

### MarketingInfo
| Property Name | Type   | Description                                          |
| ------------- | ------ | ---------------------------------------------------- |
| marketingName | string | Contents of CrosConfig in `/branding/marketing-name` |

### MemoryInfo
| Property Name           | Type   | Description                               |
| ----------------------- | ------ | ----------------------------------------- |
| totalMemoryKiB          | number | Total memory, in kilobytes                |
| freeMemoryKiB           | number | Free memory, in kilobytes                 |
| availableMemoryKiB      | number | Available memory, in kilobytes            |
| pageFaultsSinceLastBoot | number | Number of page faults since the last boot |

### BatteryInfo
| Property Name    | Type   | Description                                                                      |
| ---------------- | ------ | -------------------------------------------------------------------------------- |
| chargeFull       | number | Full capacity (Ah)                                                               |
| chargeFullDesign | number | Design capacity (Ah)                                                             |
| chargeNow        | number | Battery's charge (Ah)                                                            |
| currentNow       | number | Battery's current (A)                                                            |
| cycleCount       | number | Battery's cycle count                                                            |
| manufactureDate  | string | Manufacturing date in yyyy-mm-dd format. Included when the main battery is Smart |
| modelName        | string | Battery's model name                                                             |
| serialNumber     | string | Battery's serial number                                                          |
| status           | string | Battery's status (e.g. charging)                                                 |
| technology       | string | Used technology in the battery                                                   |
| temperature      | number | Temperature in 0.1K. Included when the main battery is Smart                     |
| vendor           | string | Battery's manufacturer                                                           |
| voltageMinDesign | number | Desired minimum output voltage                                                   |
| voltageNow       | number | Battery's voltage (V)                                                            |

### StatefulPartitionInfo
| Property Name  | Type   | Description                                                 |
| -------------- | ------ | ----------------------------------------------------------- |
| availableSpace | number | The currently available space in the user partition (Bytes) |
| totalSpace     | number | The total space of the user partition (Bytes)               |

### TpmVersion
| Property Name   | Type   | Description                                                                                                                                                                                                                                                                      |
| --------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gscVersion      | string | The version of Google security chip(GSC), or "not_gsc" if not applicable                                                                                                                                                                                                         |
| family          | number | TPM family. We use the TPM 2.0 style encoding (see [here](https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-1-Architecture-01.07-2014-03-13.pdf)  for reference), e.g.: <ul><li>TPM 1.2: "1.2" -> 0x312e3200</li><li> TPM 2.0: "2.0" -> 0x322e3000</li></ul> |
| specLevel       | number | The level of the specification that is implemented by the TPM                                                                                                                                                                                                                    |
| manufacturer    | number | A manufacturer specific code                                                                                                                                                                                                                                                     |
| tpmModel        | number | The TPM model number                                                                                                                                                                                                                                                             |
| firmwareVersion | number | The current firmware version of the TPM                                                                                                                                                                                                                                          |
| vendorSpecific  | string | Information set by the vendor                                                                                                                                                                                                                                                    |

### TpmStatus
| Property Name | Type    | Description                                                                      |
| ------------- | ------- | -------------------------------------------------------------------------------- |
| enabled       | boolean | Wheather the                                                                     |
| owned         | boolean | Whether the TPM has been owned                                                   |
| specLevel     | boolean | Whether the owner password is still retained (as part of the TPM initialization) |

### TpmDictionaryAttack
| Property Name           | Type    | Description                                                            |
| ----------------------- | ------- | ---------------------------------------------------------------------- |
| counter                 | number  | The current dictionary attack counter value                            |
| threshold               | number  | The current dictionary attack counter threshold                        |
| lockoutInEffect         | boolean | Whether the TPM is currently in some form of dictionary attack lockout |
| lockoutSecondsRemaining | number  | The number of seconds remaining in the lockout (if applicable)         |

### TpmInfo
| Property Name   | Type                | Description                                              |
| --------------- | ------------------- | -------------------------------------------------------- |
| version         | TpmVersion          | The current version of the Trusted Platform Module (TPM) |
| status          | TpmStatus           | The current status of the TPM                            |
| dictonaryAttack | TpmDictionaryAttack | TPM dictionary attack (DA) related information           |

### OsVersionInfo
| Property Name    | Type   | Description                                 |
| ---------------- | ------ | ------------------------------------------- |
| releaseMilestone | string | The release milestone (e.g. "87")           |
| buildNumber      | string | The build number (e.g. "13544")             |
| patchNumber      | string | The build number (e.g. "59.0")              |
| releaseChannel   | string | The release channel (e.g. "stable-channel") |

### BlockDeviceInfo
| Property Name | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| name          | string | The name of the block device.                                |
| type          | string | The type of the block device, (e.g. "MMC", "NVMe" or "ATA"). |
| size          | number | The device size in bytes.                                    |

### AcPowerRoutineParams
| Property Name        | Type   | Description                                                                        |
| -------------------- | ------ | ---------------------------------------------------------------------------------- |
| expected_status      | string | The expected status of the AC ('connected', 'disconnected' or 'unknown')           |
| expected_power_type* | string | If specified, this must match the type of power supply for the routine to succeed. |

### BatteryDischargeRoutineParams
| Property Name                     | Type   | Description                                                                  |
| --------------------------------- | ------ | ---------------------------------------------------------------------------- |
| length_seconds                    | number | Length of time to run the routine for                                        |
| maximum_discharge_percent_allowed | number | The routine will fail if the battery discharges by more than this percentage |

### BatteryChargeRoutineParams
| Property Name                   | Type   | Description                                                               |
| ------------------------------- | ------ | ------------------------------------------------------------------------- |
| length_seconds                  | number | Length of time to run the routine for                                     |
| minimum_charge_percent_required | number | The routine will fail if the battery charges by less than this percentage |

### CpuRoutineDurationParams
| Property Name  | Type   | Description                           |
| -------------- | ------ | ------------------------------------- |
| length_seconds | number | Length of time to run the routine for |

### NvmeWearLevelRoutineParams
| Property Name        | Type   | Description                                                                     |
| -------------------- | ------ | ------------------------------------------------------------------------------- |
| wear_level_threshold | number | Threshold number in percentage which routine examines wear level status against |

### NvmeSelfTestRoutineParams
| Property Name | Type   | Description                                      |
| ------------- | ------ | ------------------------------------------------ |
| test_type     | string | Selects between a "short_test" or a "long_test". |

### SmartctlCheckRoutineParams
| Property Name             | Type   | Description                                                                                                                                                                                           |
| ------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| percentage_used_threshold | number | an optional threshold number in percentage, range [0, 255] inclusive, that the routine examines `percentage_used` against. If not specified, the routine will default to the max allowed value (255). |

### PowerButtonRoutineParams
| Property Name   | Type   | Description                                                               |
| --------------- | ------ | ------------------------------------------------------------------------- |
| timeout_seconds | number | Number of seconds to listen for the power button events. Range: [1, 600]. |

### BluetoothScanningRoutineParams
| Property Name  | Type   | Description                            |
| -------------- | ------ | -------------------------------------- |
| length_seconds | number | Length of time to run the routine for. |

### BluetoothPairingRoutineParams
| Property Name | Type   | Description                                                                                                                        |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| peripheral_id | string | The unique id of the target peripheral device to test. This id can be obtained from the output of the runBluetoothScanningRoutine. |

### UsbBusInterfaceInfo
| Property Name   | Type   | Description                                                                                                                                                                |
| --------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| interfaceNumber | number | The zero-based number (index) of the interface                                                                                                                             |
| classId         | number | The class id can be used to classify / identify the usb interfaces. See the usb.ids database for the values (https://github.com/gentoo/hwids)                              |
| subclassId      | number | The subclass id can be used to classify / identify the usb interfaces. See the usb.ids database for the values (https://github.com/gentoo/hwids)                           |
| protocolId      | number | The protocol id can be used to classify / identify the usb interfaces. See the usb.ids database for the values (https://github.com/gentoo/hwids)                           |
| driver          | string | The driver used by the device. This is the name of the matched driver which is registered in the kernel. See "{kernel root}/drivers/" for the list of the built in drivers |

### Enum FwupdVersionFormat
| Property Name | Description                                |
| ------------- | ------------------------------------------ |
| plain         | An unidentified format text string         |
| number        | A single integer version number            |
| pair          | Two AABB.CCDD version numbers              |
| triplet       | Microsoft-style AA.BB.CCDD version numbers |
| quad          | UEFI-style AA.BB.CC.DD version numbers     |
| bcd           | Binary coded decimal notation              |
| intelMe       | Intel ME-style bitshifted notation         |
| intelMe2      | Intel ME-style A.B.CC.DDDD notation        |
| surfaceLegacy | Legacy Microsoft Surface 10b.12b.10b       |
| surface       | Microsoft Surface 8b.16b.8b                |
| dellBios      | Dell BIOS BB.CC.DD style                   |
| hex           | Hexadecimal 0xAABCCDD style                |

### FwupdFirmwareVersionInfo
| Property Name  | Type               | Description                               |
| -------------- | ------------------ | ----------------------------------------- |
| version        | string             | The string form of the firmware version   |
| version_format | FwupdVersionFormat | The format for parsing the version string |

### Enum UsbVersion
| Property Name |
------------ |
| unknown |
| usb1 |
| usb2 |
| usb3 |

### Enum UsbSpecSpeed
An enumeration of the usb spec speed in Mbps.
Source:

1. https://www.kernel.org/doc/Documentation/ABI/testing/sysfs-bus-usb
2. https://www.kernel.org/doc/Documentation/ABI/stable/sysfs-bus-usb
3. https://en.wikipedia.org/wiki/USB

| Property Name | Description          |
| ------------- | -------------------- |
| unknown       | Unknown speed        |
| n1_5Mbps      | Low speed            |
| n12Mbps       | Full speed           |
| n480Mbps      | High Speed           |
| n5Gbps        | Super Speed          |
| n10Gbps       | Super Speed+         |
| n20Gbps       | Super Speed+ Gen 2x2 |

### UsbBusInfo
| Property Name            | Type                         | Description                                                                                                                                                                                                                                                            |
| ------------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| classId                  | number                       | The class id can be used to classify / identify the usb interfaces. See the usb.ids database for the values (https://github.com/gentoo/hwids)                                                                                                                          |
| subclassId               | number                       | The subclass id can be used to classify / identify the usb interfaces. See the usb.ids database for the values (https://github.com/gentoo/hwids)                                                                                                                       |
| protocolId               | number                       | The protocol id can be used to classify / identify the usb interfaces. See the usb.ids database for the values (https://github.com/gentoo/hwids)                                                                                                                       |
| vendorId                 | number                       | The vendor id can be used to classify / identify the usb interfaces. See the usb.ids database for the values (https://github.com/gentoo/hwids)                                                                                                                         |
| productId                | number                       | The product id can be used to classify / identify the usb interfaces. See the usb.ids database for the values (https://github.com/gentoo/hwids)                                                                                                                        |
| interfaces               | Array\<UsbBusInterfaceInfo\> | The usb interfaces under the device. A usb device has at least one interface. Each interface may or may not work independently, based on each device. This allows a usb device to provide multiple features. The interfaces are sorted by the `interface_number` field |
| fwupdFirmwareVersionInfo | FwupdFirmwareVersionInfo     | The firmware version obtained from fwupd                                                                                                                                                                                                                               |
| version                  | UsbVersion                   | The recognized usb version. It may not be the highest USB version supported by the hardware                                                                                                                                                                            |
| spec_speed               | UsbSpecSpeed                 | The spec usb speed                                                                                                                                                                                                                                                     |

### UsbDevicesInfo
| Property Name | Type                | Description                                 |
| ------------- | ------------------- | ------------------------------------------- |
| devices       | Array\<UsbBusInfo\> | Information about all connected USB devices |

### Enum DisplayInputType
| Property Name | Description        |
| ------------- | ------------------ |
| unknown       | Unknown enum value |
| digital       | Digital input      |
| analog        | Analog input       |

### EmbeddedDisplayInfo
| Property Name          | Type             | Description                                                                                        |
| ---------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| privacyScreenSupported | bool             | Privacy screen is supported or not                                                                 |
| privacyScreenEnabled   | bool             | Privacy screen is enabled or not                                                                   |
| displayWidth           | number           | Display width in millimeters                                                                       |
| displayHeight          | number           | Display height in millimeters                                                                      |
| resolutionHorizontal   | number           | Horizontal resolution                                                                              |
| resolutionVertical     | number           | Vertical resolution                                                                                |
| refreshRate            | number           | Refresh rate                                                                                       |
| manufacturer           | string           | Three letter manufacturer ID                                                                       |
| modelId                | number           | Manufacturer product code                                                                          |
| serialNumber           | number           | 32 bits serial number. Starting from M120, this field is always empty due to privacy requirements. |
| manufactureWeek        | number           | Week of manufacture                                                                                |
| manufactureYear        | number           | Year of manufacture                                                                                |
| edidVersion            | string           | EDID version                                                                                       |
| inputType              | DisplayInputType | Digital or analog input                                                                            |
| displayName            | string           | Name of display product                                                                            |

### ExternalDisplayInfo
| Property Name        | Type             | Description                                                                                        |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| displayWidth         | number           | Display width in millimeters                                                                       |
| displayHeight        | number           | Display height in millimeters                                                                      |
| resolutionHorizontal | number           | Horizontal resolution                                                                              |
| resolutionVertical   | number           | Vertical resolution                                                                                |
| refreshRate          | number           | Refresh rate                                                                                       |
| manufacturer         | string           | Three letter manufacturer ID                                                                       |
| modelId              | number           | Manufacturer product code                                                                          |
| serialNumber         | number           | 32 bits serial number. Starting from M120, this field is always empty due to privacy requirements. |
| manufactureWeek      | number           | Week of manufacture                                                                                |
| manufactureYear      | number           | Year of manufacture                                                                                |
| edidVersion          | string           | EDID version                                                                                       |
| inputType            | DisplayInputType | Digital or analog input                                                                            |
| displayName          | string           | Name of display product                                                                            |

### DisplayInfo
| Property Name    | Type                         | Description                         |
| ---------------- | ---------------------------- | ----------------------------------- |
| embeddedDisplay  | EmbeddedDisplayInfo          | Information about embedded display  |
| externalDisplays | Array\<ExternalDisplayInfo\> | Information about external displays |

## Functions
### dpsl.telemetry.*
| Function Name                   | Definition                                | Permission needed to access                                          | Released in `dpsl` version |
| ------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- | -------------------------- |
| getVpdInfo                      | () => Promise\<VpdInfo\>                  | `os.telemetry`, `os.telemetry.serial_number` for serial number field | 1.0.0                      |
| getOemData                      | () => Promise\<OemDataInfo\>              | `os.telemetry`, `os.telemetry.serial_number` for the whole result    | 1.0.0                      |
| getCpuInfo                      | () => Promise\<CpuInfo\>                  | `os.telemetry`                                                       | 1.2.0                      |
| getMemoryInfo                   | () => Promise\<MemoryInfo\>               | `os.telemetry`                                                       | 1.2.0                      |
| getBatteryInfo                  | () => Promise\<BatteryInfo\>              | `os.telemetry`, `os.telemetry.serial_number` for serial number field | 1.3.0                      |
| getStatefulPartitionInfo        | () => Promise\<StatefulPartitionInfo\>    | `os.telemetry`                                                       | 1.3.1                      |
| getOsVersionInfo                | () => Promise\<OsVersionInfo\>            | `os.telemetry`                                                       | 1.3.1                      |
| getNonRemovableBlockDevicesInfo | () => Promise\<BlockDeviceInfo\>          | `os.telemetry`                                                       | 1.3.2                      |
| getInternetConnectivityInfo     | () => Promise\<InternetConnectivityInfo\> | `os.telemetry`, `os.telemetry.network_info` for MAC address field    | 1.3.2                      |
| getTpmInfo                      | () => Promise\<TpmInfo\>                  | `os.telemetry`                                                       | 1.3.2                      |
| getAudioInfo                    | () => Promise\<AudioInfo\>                | `os.telemetry`                                                       | 1.3.4                      |
| getMarketingInfo                | () => Promise\<MarketingInfo\>            | `os.telemetry`                                                       | 1.3.4                      |
| getUsbBusInfo                   | () => Promise\<UsbDevicesInfo\>           | `os.telemetry`, `os.attached_device_info`                            | 1.3.5                      |
| getDisplayInfo                  | () => Promise\<DisplayInfo\>              | `os.telemetry`                                                       | 1.3.6                      |

### dpsl.diagnostics.*
| Function Name        | Definition                      | Permission needed to access | Released in `dpsl` version |
| -------------------- | ------------------------------- | --------------------------- | -------------------------- |
| getAvailableRoutines | () => Promise\<List\<string\>\> | `os.diagnostics`            | 1.0.0                      |

### dpsl.diagnostics.power.*
| Function Name     | Definition                                           | Permission needed to access | Released in `dpsl` version |
| ----------------- | ---------------------------------------------------- | --------------------------- | -------------------------- |
| runAcPowerRoutine | (params: AcPowerRoutineParams) => Promise\<Routine\> | `os.diagnostics`            | 1.3.1                      |

### dpsl.diagnostics.battery.*
| Function Name       | Definition                                                    | Permission needed to access | Released in `dpsl` version |
| ------------------- | ------------------------------------------------------------- | --------------------------- | -------------------------- |
| runCapacityRoutine  | () => Promise\<Routine\>                                      | `os.diagnostics`            | 1.0.0                      |
| runHealthRoutine    | () => Promise\<Routine\>                                      | `os.diagnostics`            | 1.0.0                      |
| runDischargeRoutine | (params: BatteryDischargeRoutineParams) => Promise\<Routine\> | `os.diagnostics`            | 1.0.0                      |
| runChargeRoutine    | (params: BatteryChargeRoutineParams) => Promise\<Routine\>    | `os.diagnostics`            | 1.0.0                      |

### dpsl.diagnostics.cpu.*
| Function Name                   | Definition                                               | Permission needed to access | Released in `dpsl` version |
| ------------------------------- | -------------------------------------------------------- | --------------------------- | -------------------------- |
| runCacheRoutine                 | (params: CpuRoutineDurationParams) => Promise\<Routine\> | `os.diagnostics`            | 1.0.0                      |
| runStressRoutine                | (params: CpuRoutineDurationParams) => Promise\<Routine\> | `os.diagnostics`            | 1.0.0                      |
| runFloatingPointAccuracyRoutine | (params: CpuRoutineDurationParams) => Promise\<Routine\> | `os.diagnostics`            | 1.1.0                      |
| runPrimeSearchRoutine           | (params: CpuRoutineDurationParams) => Promise\<Routine\> | `os.diagnostics`            | 1.1.0                      |

### dpsl.diagnostics.memory.*
| Function Name    | Definition               | Permission needed to access | Released in `dpsl` version |
| ---------------- | ------------------------ | --------------------------- | -------------------------- |
| runMemoryRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.0.0                      |

### dpsl.diagnostics.disk.*
| Function Name  | Definition               | Permission needed to access | Released in `dpsl` version |
| -------------- | ------------------------ | --------------------------- | -------------------------- |
| runReadRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.1                      |

### dpsl.diagnostics.emmc.*
| Function Name          | Definition               | Permission needed to access | Released in `dpsl` version |
| ---------------------- | ------------------------ | --------------------------- | -------------------------- |
| runEmmcLifetimeRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.3                      |

### dpsl.diagnostics.nvme.*
| Function Name           | Definition                                                  | Permission needed to access | Released in `dpsl` version                                                                                                                                          |
| ----------------------- | ----------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| runSmartctlCheckRoutine | (params: SmartctlCheckRoutineParams?) => Promise\<Routine\> | `os.diagnostics`            | intial release: 1.3.0, new parameter added: 1.3.3. The parameter is only available if "smartctl_check_with_percentage_used" is returned from `GetAvailableRoutines` |
| runWearLevelRoutine     | (params: NvmeWearLevelRoutineParams) => Promise\<Routine\>  | `os.diagnostics`            | 1.3.0                                                                                                                                                               |
| runSelfTestRoutine      | (params: NvmeSelfTestRoutineParams) => Promise\<Routine\>   | `os.diagnostics`            | 1.3.3                                                                                                                                                               |

### dpsl.diagnostics.ufs.*
| Function Name         | Definition               | Permission needed to access | Released in `dpsl` version |
| --------------------- | ------------------------ | --------------------------- | -------------------------- |
| runUfsLifetimeRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.6                      |

### dpsl.diagnostics.network.*
| Function Name                | Definition               | Permission needed to access | Released in `dpsl` version |
| ---------------------------- | ------------------------ | --------------------------- | -------------------------- |
| runLanConnectivityRoutine    | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.0                      |
| runSignalStrengthRoutine     | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.2                      |
| runDnsResolverPresentRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.2                      |
| runDnsResolutionRoutine      | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.2                      |
| runGatewayCanBePingedRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.2                      |

### dpsl.diagnostics.sensor.*
| Function Name              | Definition               | Permission needed to access | Released in `dpsl` version |
| -------------------------- | ------------------------ | --------------------------- | -------------------------- |
| runSensitiveSensorRoutine  | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.3                      |
| runFingerprintAliveRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.3                      |

### dpsl.diagnostics.audio.*
| Function Name         | Definition               | Permission needed to access | Released in `dpsl` version |
| --------------------- | ------------------------ | --------------------------- | -------------------------- |
| runAudioDriverRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.6                      |

### dpsl.diagnostics.hardwareButton.*
| Function Name         | Definition                                               | Permission needed to access | Released in `dpsl` version |
| --------------------- | -------------------------------------------------------- | --------------------------- | -------------------------- |
| runPowerButtonRoutine | (params: PowerButtonRoutineParams) => Promise\<Routine\> | `os.diagnostics`            | 1.3.6                      |

### dpsl.diagnostics.bluetooth.*
| Function Name                | Definition                                                     | Permission needed to access                       | Released in `dpsl` version |
| ---------------------------- | -------------------------------------------------------------- | ------------------------------------------------- | -------------------------- |
| runBluetoothPowerRoutine     | () => Promise\<Routine\>                                       | `os.diagnostics`                                  | 1.3.6                      |
| runBluetoothDiscoveryRoutine | () => Promise\<Routine\>                                       | `os.diagnostics`                                  | 1.3.7                      |
| runBluetoothScanningRoutine  | (params: BluetoothScanningRoutineParams) => Promise\<Routine\> | `os.diagnostics`, `os.bluetooth_peripherals_info` | 1.3.7                      |
| runBluetoothPairingRoutine   | (params: BluetoothPairingRoutineParams) => Promise\<Routine\>  | `os.diagnostics`, `os.bluetooth_peripherals_info` | 1.3.7                      |

### dpsl.diagnostics.fan.*
| Function Name | Definition               | Permission needed to access | Released in `dpsl` version |
| ------------- | ------------------------ | --------------------------- | -------------------------- |
| runFanRoutine | () => Promise\<Routine\> | `os.diagnostics`            | 1.3.8                      |


## Status codes & messages

### Shared status codes

The following status codes are shared by all routines.

| Code            | Status message                                                                |
| --------------- | ----------------------------------------------------------------------------- |
| `0x0000001`     | Routine passed. (Note that some routines may have different success messages) |
| **`0x0000002`** | (Exceptions raised by routines; refer to each routine for exact messages)     |

### List of status codes by routine

#### Audio Driver

| Code            | Status message                                  |
| --------------- | ----------------------------------------------- |
| `0x0060001`     | No internal audio card detected.                |
| `0x0060002`     | One or more audio devices failed to open.       |
| **`0x0000002`** | Failed to get detected internal card from cras. |
| **`0x0000002`** | Failed retrieving node info from cras.          |

#### AC Power
| Code            | Status message                                            |
| --------------- | --------------------------------------------------------- |
| `0x0010001`     | Expected online power supply, found offline power supply. |
| `0x0010002`     | Expected offline power supply, found online power supply. |
| `0x0010003`     | Read power type different from expected power type.       |
| **`0x0000002`** | No valid AC power supply found.                           |

#### Battery Capacity
| Code            | Status message                                     |
| --------------- | -------------------------------------------------- |
| `0x0070001`     | Battery design capacity not within given limits.   |
| **`0x0000002`** | Invalid BatteryCapacityRoutineParameters.          |
| **`0x0000002`** | Failed to get power supply properties from powerd. |

#### Battery Charge
| Code            | Status message                                                    |
| --------------- | ----------------------------------------------------------------- |
| `0x0080001`     | Battery is not charging.                                          |
| `0x0080002`     | Battery charge percent less than minimum required charge percent. |
| **`0x0000002`** | Invalid minimum required charge percent requested.                |
| **`0x0000002`** | Failed to read battery attributes from sysfs.                     |
| **`0x0000002`** | Failed to get power supply properties from powerd.                |

#### Battery Discharge
| Code            | Status message                                                       |
| --------------- | -------------------------------------------------------------------- |
| `0x0090001`     | Battery is not discharging.                                          |
| `0x0090002`     | Battery discharge rate greater than maximum allowed discharge rate.  |
| **`0x0000002`** | Maximum allowed discharge percent must be less than or equal to 100. |
| **`0x0000002`** | Failed to read battery attributes from sysfs.                        |
| **`0x0000002`** | Failed to get power supply properties from powerd.                   |

#### Battery Health
| Code            | Status message                                     |
| --------------- | -------------------------------------------------- |
| `0x00A0001`     | Battery is over-worn.                              |
| `0x00A0002`     | Battery cycle count is too high.                   |
| **`0x0000002`** | Could not get cycle count.                         |
| **`0x0000002`** | Invalid battery health routine parameters.         |
| **`0x0000002`** | Could not get wear percentage.                     |
| **`0x0000002`** | Failed to get power supply properties from powerd. |

#### Bluetooth Power
| Code            | Status message                                                        |
| --------------- | --------------------------------------------------------------------- |
| `0x00D0001`     | Bluetooth routine is not supported when adapter is in discovery mode. |
| `0x00D0002`     | Bluetooth routine failed to get main adapter.                         |
| `0x00D0003`     | Bluetooth routine failed to change adapter powered status.            |
| `0x00D0004`     | Bluetooth routine failed to validate adapter powered status.          |
| **`0x0000002`** | Unexpected Bluetooth diagnostic flow.                                 |

#### Bluetooth Discovery
| Code            | Status message                                                   |
| --------------- | ---------------------------------------------------------------- |
| `0x00B0001`     | Bluetooth routine failed to validate adapter discovering status. |
| `0x00B0002`     | Bluetooth routine failed to get main adapter.                    |
| `0x00B0003`     | Bluetooth routine failed to change adapter powered status.       |
| `0x00B0004`     | Bluetooth routine failed to switch adapter discovery mode.       |
| **`0x0000002`** | Unexpected Bluetooth diagnostic flow.                            |

#### Bluetooth Pairing
| Code            | Status message                                                  |
| --------------- | --------------------------------------------------------------- |
| `0x00C0001`     | Bluetooth routine failed to find the device with peripheral ID. |
| `0x00C0002`     | Bluetooth routine failed to create baseband connection.         |
| `0x00C0003`     | Bluetooth routine failed to finish pairing.                     |
| `0x00C0004`     | Bluetooth routine failed to get main adapter.                   |
| `0x00C0005`     | Bluetooth routine failed to change adapter powered status.      |
| `0x00C0006`     | Bluetooth routine failed to switch adapter discovery mode.      |
| `0x00C0007`     | Bluetooth routine failed to remove target peripheral.           |
| `0x00C0008`     | The target peripheral is already paired                         |
| **`0x0000002`** | Bluetooth routine failed to set target device's alias           |
| **`0x0000002`** | Unexpected Bluetooth diagnostic flow.                           |

#### Bluetooth Scanning
| Code            | Status message                                               |
| --------------- | ------------------------------------------------------------ |
| `0x00E0001`     | Bluetooth routine failed to change adapter powered status.   |
| `0x00E0002`     | Bluetooth routine failed to switch adapter discovery mode.   |
| `0x00E0003`     | Bluetooth routine failed to get main adapter.                |
| **`0x0000002`** | Routine execution time should be strictly greater than zero. |
| **`0x0000002`** | Unexpected Bluetooth diagnostic flow.                        |

#### Fan
| Code            | Status message                                       |
| --------------- | ---------------------------------------------------- |
| `0x0170001`     | One or more fans cannot be set to certain speed.     |
| **`0x0000002`** | cros config fan count must be a valid number         |
| **`0x0000002`** | routine unsupported for device with no fan           |
| **`0x0000002`** | Invalid routine stage                                |
| **`0x0000002`** | Failed to get number of fans                         |
| **`0x0000002`** | Failed to read fan speed                             |
| **`0x0000002`** | Failed to set fan speed                              |
| **`0x0000002`** | Failed to read thermal sensor version                |
| **`0x0000002`** | Failed to read temperature for thermal sensor idx: X |
| **`0x0000002`** | Error initializing udev                              |

#### Fingerprint Alive
| Code        | Status message                               |
| ----------- | -------------------------------------------- |
| `0x0190001` | Failed to get fingerprint info.              |
| `0x0190002` | Fingerprint does not use a RW firmware copy. |

#### Power Button
| Code            | Status message                                           |
| --------------- | -------------------------------------------------------- |
| `0x0250001`     | Routine failed. No power button event observed.          |
| **`0x0000002`** | Timeout is not in range [%u, %u]                         |
| **`0x0000002`** | Routine error. Unable to listen for power button events. |

#### CPU Cache
| Code            | Status message                                       |
| --------------- | ---------------------------------------------------- |
| `0x0100001`     | One or more subtests failed.                         |
| **`0x0000002`** | Memory info not found                                |
| **`0x0000002`** | Not enough memory to run stressapptest               |
| **`0x0000002`** | process control disconnected before routine finished |

#### CPU Stress
| Code            | Status message                                       |
| --------------- | ---------------------------------------------------- |
| `0x0110001`     | One or more subtests failed.                         |
| **`0x0000002`** | Memory info not found                                |
| **`0x0000002`** | Not enough memory to run stressapptest               |
| **`0x0000002`** | process control disconnected before routine finished |

#### Memory
| Code            | Status message                                                       |
| --------------- | -------------------------------------------------------------------- |
| `0x0220001`     | One or more subtests failed.                                         |
| **`0x0000002`** | Memory info not found                                                |
| **`0x0000002`** | Less than 4 KiB memory available, not enough to run memtester.       |
| **`0x0000002`** | Error in calling memtester                                           |
| **`0x0000002`** | Error allocating or locking memory, or invoking the memtester binary |
| **`0x0000002`** | Error parsing memtester output                                       |

#### Floating Point Accuracy
No codes are defined for Floating Point Accuracy.

#### DNS Resolution
| Code            | Status message                      |
| --------------- | ----------------------------------- |
| `0x0140001`     | Failed to resolve host.             |
| **`0x0000002`** | DNS resolution routine did not run. |

#### DNS Resolver Present
| Code            | Status message                                              |
| --------------- | ----------------------------------------------------------- |
| `0x0150001`     | IP config has no list of name servers available.            |
| `0x0150002`     | IP config has a list of at least one malformed name server. |
| **`0x0000002`** | DNS resolver present routine did not run.                   |

#### Gateway can be Pinged
| Code            | Status message                                                             |
| --------------- | -------------------------------------------------------------------------- |
| `0x01B0001`     | All gateways are unreachable, hence cannot be pinged.                      |
| `0x01B0002`     | The default network cannot be pinged.                                      |
| `0x01B0003`     | The default network has a latency above the threshold.                     |
| `0x01B0004`     | One or more of the non-default networks has failed pings.                  |
| `0x01B0005`     | One or more of the non-default networks has a latency above the threshold. |
| **`0x0000002`** | Gateway can be pinged routine did not run.                                 |

#### LAN Connectivity
| Code            | Status message                        |
| --------------- | ------------------------------------- |
| `0x0200001`     | No LAN Connectivity detected.         |
| **`0x0000002`** | LAN Connectivity routine did not run. |

#### Signal Strength
| Code            | Status message                       |
| --------------- | ------------------------------------ |
| `0x0290001`     | Weak signal detected.                |
| **`0x0000002`** | Signal strength routine did not run. |

#### Sensitive Sensor
| Code            | Status message                                               |
| --------------- | ------------------------------------------------------------ |
| `0x0280001`     | Sensitive sensor routine failed to pass all sensors.         |
| `0x0280002`     | Sensitive sensor routine failed to pass configuration check. |
| **`0x0000002`** | Sensitive sensor routine failed unexpectedly.                |

#### Disk Read
| Code            | Status message                                                                          |
| --------------- | --------------------------------------------------------------------------------------- |
| **`0x0000002`** | Disk read duration should not be zero after rounding towards zero to the nearest second |
| **`0x0000002`** | Test file size should not be zero                                                       |
| **`0x0000002`** | Unexpected disk read type                                                               |
| **`0x0000002`** | Unexpected flow in disk read routine                                                    |
| **`0x0000002`** | Failed to clean up storage                                                              |
| **`0x0000002`** | Failed to retrieve free storage space                                                   |
| **`0x0000002`** | Failed to reserve sufficient storage space                                              |
| **`0x0000002`** | Failed to complete fio prepare job                                                      |
| **`0x0000002`** | Failed to complete fio read job                                                         |
| **`0x0000002`** | Failed to access fio stderr                                                             |
| **`0x0000002`** | Failed to read fio stderr                                                               |

#### Emmc Lifetime
| Code            | Status message              |
| --------------- | --------------------------- |
| `0x0160001`     | Pre-EOL info is not normal. |
| **`0x0000002`** | Debugd returns error.       |
| **`0x0000002`** | Failed to parse mmc output. |

#### NVMe Self Test
| Code            | Status message                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0x0230001`     | SelfTest status: self-test failed to start.                                                                                                                         |
| `0x0230002`     | SelfTest status: Operation was aborted by Device Self-test command.                                                                                                 |
| `0x0230003`     | SelfTest status: Operation was aborted by a Controller Level Reset.                                                                                                 |
| `0x0230004`     | SelfTest status: Operation was aborted due to a removal of a namespace from the namespace inventory.                                                                |
| `0x0230005`     | SelfTest Status: Operation was aborted due to the processing of a Format NVM command.                                                                               |
| `0x0230006`     | SelfTest status: A fatal error or unknown test error occurred while the controller was executing the device self-test operation and the operation did not complete. |
| `0x0230007`     | SelfTest status: Operation completed with a segment that failed and the segment that failed is not known.                                                           |
| `0x0230008`     | SelfTest status: Operation completed with one or more failed segments and the first segment that failed is indicated in the Segment Number field.                   |
| `0x0230009`     | SelfTest status: Operation was aborted for an unknown reason.                                                                                                       |
| **`0x0000002`** | SelfTest status: ERROR, self-test abortion failed.                                                                                                                  |
| **`0x0000002`** | SelfTest status: ERROR, cannot get percent info.                                                                                                                    |
| **`0x0000002`** | SelfTest status: Unknown complete status.                                                                                                                           |

#### NVMe Wear Level
| Code            | Status message                                                                       |
| --------------- | ------------------------------------------------------------------------------------ |
| `0x0240001`     | Wear-level status: FAILED, exceed the limitation value.                              |
| **`0x0000002`** | Wear-level status: ERROR, threshold in percentage should be non-empty and under 100. |
| **`0x0000002`** | Wear-level status: ERROR, cannot get wear level info.                                |

#### Prime Search
No codes are defined for Prime Search.

#### Smartctl Check
| Code            | Status message                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `0x02A0001`     | smartctl-check status: FAILED, one or more checks have failed.                                              |
| **`0x0000002`** | smartctl-check status: ERROR, threshold in percentage should be non-empty and between 0 and 255, inclusive. |
| **`0x0000002`** | smartctl-check status: FAILED, unable to parse smartctl output.                                             |
| **`0x0000002`** | smartctl-check status: ERROR, debugd returns error.                                                         |

#### UFS Life Time
| Code            | Status message                                                     |
| --------------- | ------------------------------------------------------------------ |
| `0x02B0001`     | Pre-EOL info is not normal.                                        |
| **`0x0000002`** | Unable to determine a bsg node path                                |
| **`0x0000002`** | Unable to deduce health descriptor path based on the bsg node path |
| **`0x0000002`** | Error reading content from UFS health descriptor                   |
