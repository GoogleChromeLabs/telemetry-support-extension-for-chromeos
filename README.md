# Telemetry Support Library for ChromeOS

This repository contains a library code that facilitates access to the telemetry
and diagnostics APIs on ChromeOS.

The code in this repository contains most of the code from
[dpsl](https://source.chromium.org/chromium/chromium/src/+/main:ash/webui/telemetry_extension_ui/resources/dpsl/)
and is tweaked to integrate with the ChromeOS system extension APIs.

## Usages

The library is published via npm and can be included by importing code.
The importing code represents a special type of chrome extensions
(chromeos_system_extension). It should package this library code with the
extenion resources before serving (inside the crx file).

npm package name: **cros-dpsl-js**.

Publishing status: published in [npm](https://www.npmjs.com/package/cros-dpsl-js).

## Instructions

1. `npm install cros-dpsl-js`
2. Import the package in your source code: `import { dpsl } from 'cros-dpsl-js';`
3. Begin using the library through the dpsl.\* namespace.
4. See the currently supported APIs and sample usages in [src/README.md](https://github.com/GoogleChromeLabs/telemetry-support-extension-for-chromeos/blob/main/src/README.md).

Currently, the library is integrated in another project. Refer to usages to know more: [cros-sample-telemetry-extension](https://github.com/GoogleChromeLabs/cros-sample-telemetry-extension).
