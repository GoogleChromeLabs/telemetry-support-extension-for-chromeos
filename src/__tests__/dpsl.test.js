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

import dpsl from '../dpsl.js';

describe('dpsl.telemetry tests', () => {
  let originalChrome;
  beforeEach(() => {
    originalChrome = global.chrome;
  });
  afterEach(() => {
    global.chrome = originalChrome;
  });

  test('dpsl.telemetry binding exists', () => {
    expect(dpsl.telemetry).toBeDefined();
    expect(dpsl.telemetry).not.toBeNull();
  });

  test('dpsl.telemetry.getVpdInfo() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedVpdInfo = {
      'activateDate': '2021-50',
      'modelName': 'COOL-LAPTOP-CHROME',
      'serialNumber': '5CD9999999',
      'skuNumber': 'sku15',
    };
    const chrome = {
      os: {
        telemetry: {
          getVpdInfo: () => expectedVpdInfo,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getVpdInfo().then((vpdInfo) => {
      expect(vpdInfo).toEqual(expectedVpdInfo);
      done();
    });
  });

  test('dpsl.telemetry.getOemData() returns correct data', (done) => {
    // Mock the global chrome object.
    const expectedOemData = 'oemdata: response from GetLog';
    const chrome = {
      os: {
        telemetry: {
          getOemData: () => expectedOemData,
        },
      },
    };
    global.chrome = chrome;

    dpsl.telemetry.getOemData().then((oemData) => {
      expect(oemData).toEqual(expectedOemData);
      done();
    });
  });
});
