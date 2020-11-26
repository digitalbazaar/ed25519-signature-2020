/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
// import * as base58btc from 'base58-universal';
// import {mockKey, seed} from './mock-data.js';
chai.should();
// const {expect} = chai;

import {Ed25519Signature2020} from '../';

describe('Ed25519Signature2020', () => {
  describe('constructor', () => {
    it('should exist', async () => {
      Ed25519Signature2020.should.exist;
    });

  });
});
