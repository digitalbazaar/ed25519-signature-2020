/*
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
const nodejs = (
  typeof process !== 'undefined' && process.versions && process.versions.node);
let TextDecoder, TextEncoder;

if(nodejs) {
  // Node.js TextDecoder/TextEncoder
  const util = require('util');
  TextEncoder = util.TextEncoder;
  TextDecoder = util.TextDecoder;
} else {
  /* eslint-env browser */
  TextDecoder = self.TextDecoder;
  TextEncoder = self.TextEncoder;
}

function stringToUint8Array(data) {
  if(typeof data === 'string') {
    // convert data to Uint8Array
    return new TextEncoder().encode(data);
  }
  if(!(data instanceof Uint8Array)) {
    throw new TypeError('"data" be a string or Uint8Array.');
  }
  return data;
}

module.exports = {
  TextDecoder,
  TextEncoder,
  stringToUint8Array
};
