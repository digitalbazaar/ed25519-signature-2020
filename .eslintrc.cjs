/*!
 * Copyright (c) 2020-2022 Digital Bazaar, Inc. All rights reserved.
 */
module.exports = {
  root: true,
  extends: [
    'digitalbazaar',
    'digitalbazaar/jsdoc',
    'digitalbazaar/module'
  ],
  env: {
    node: true
  },
  rules: {
    'jsdoc/check-examples': 0,
    'jsdoc/require-description-complete-sentence': 0,
    'unicorn/prefer-node-protocol': 'error'
  }
};
