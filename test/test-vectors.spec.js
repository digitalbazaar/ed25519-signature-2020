/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import {Ed25519Signature2020} from '../lib/index.js';
import {expect} from 'chai';
import jsigs from 'jsonld-signatures';
import {loader} from './documentLoader.js';

import * as testVectors from './test-vectors.js';

const {purposes: {AssertionProofPurpose}} = jsigs;

const documentLoader = loader.build();

describe('test vectors', () => {
  let keyPair;
  before(async () => {
    const {keyMaterial} = testVectors;
    keyPair = await Ed25519Multikey.from(keyMaterial);
    keyPair.controller = `did:key:${keyPair.publicKeyMultibase}`;
    keyPair.id = `${keyPair.controller}#${keyPair.publicKeyMultibase}`;
  });

  it('should create proof', async () => {
    const {signedFixture} = testVectors;
    const unsigned = {...signedFixture};
    delete unsigned.proof;

    const signer = keyPair.signer();
    const date = new Date(signedFixture.proof.created);

    let error;
    let signed;
    try {
      signed = await jsigs.sign(unsigned, {
        suite: new Ed25519Signature2020({signer, date}),
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
    } catch(e) {
      error = e;
    }

    expect(error).to.not.exist;
    expect(signed).to.deep.equal(signedFixture);
  });

  it('should verify signed fixture', async () => {
    const {signedFixture} = testVectors;

    const result = await jsigs.verify(signedFixture, {
      suite: new Ed25519Signature2020(),
      purpose: new AssertionProofPurpose(),
      documentLoader
    });

    expect(result.verified).to.be.true;
  });
});
