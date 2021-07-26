# Telemetry Support Extension for Chrome OS

This repository contains code for the
[shared module](https://developer.chrome.com/docs/extensions/mv2/shared_modules/)
extension that acts as an API to access telemetry and diagnostics chrome
extension APIs.

The code in this repository contains most of the code from
[dpsl](https://source.chromium.org/chromium/chromium/src/+/main:chromeos/components/telemetry_extension_ui/resources/dpsl/)
 and is tweaked as a valid shared module chrome extension
 (with manifest.json ... etc).

# Usages

Chrome extensions can include this module in 'import'
[manifest](https://developer.chrome.com/docs/extensions/mv3/manifest/) entry.
If allowed*, the extension gains access to the set of telemetry and diagnostics
APIs. See
[examples](https://source.chromium.org/chromium/chromium/src/+/main:chromeos/components/telemetry_extension_ui/resources/dpsl/)
.

(*) Only allowed chrome extension IDs can import this extension. This is because
the underlying chrome extension APIs are only exposed to certain chrome
extension IDs. See [this](https://source.chromium.org/chromium/chromium/src/+/main:chrome/common/chromeos/extensions/api/_manifest_features.json;l=19)
