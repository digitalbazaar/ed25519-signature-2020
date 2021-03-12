/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
module.exports = {
  globals: {
    should: true,
    assertNoError: true
  },
  env: {
    node: true,
    mocha: true
  },
  extends: [
    'digitalbazaar'
  ]
};
