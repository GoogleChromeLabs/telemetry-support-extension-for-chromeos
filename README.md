# Telemetry Support Library for Chrome OS

This repository contains a library code that facilitates access to the telemetry
and diagnostics APIs on Chrome OS.

The code in this repository contains most of the code from
[dpsl](https://source.chromium.org/chromium/chromium/src/+/main:chromeos/components/telemetry_extension_ui/resources/dpsl/)
 and is tweaked to integrate with the Chrome OS system extension APIs.

# Usages

The library is published via npm and can be included by importing code.
The importing code represents a special type of chrome extensions
(chromeos_system_extension). It should package this library code with the
extenion resources before serving (inside the crx file).

npm package name: cros-dpsl-js.

Publishing status: In development.

# Development Instructions

**Prerequisites**

1. npm 7.20+

**Instructions**

1. `npm install`
