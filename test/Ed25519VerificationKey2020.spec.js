/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
chai.should();
const {expect} = chai;

import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;

import {Ed25519VerificationKey2020} from
  '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020} from '../';
import {credential, mockKey, controllerDoc} from './mock-data.js';

import {
  documentLoaderFactory,
  contexts,
} from '@transmute/jsonld-document-loader';

import * as ed25519 from 'ed25519-signature-2020-context';

describe('Ed25519Signature2020', () => {
  let documentLoader;

  before(async () => {
    documentLoader = documentLoaderFactory.pluginFactory
      .build({
        contexts: {
          ...contexts.W3C_Verifiable_Credentials,
          'https://w3id.org/security/ed25519-signature-2020/v1': ed25519
            .contexts.get('https://w3id.org/security/ed25519-signature-2020/v1')
        }
      })
      .addContext({
        [mockKey.controller]: controllerDoc
      })
      .buildDocumentLoader();
  });

  describe('constructor', () => {
    it('should exist', async () => {
      Ed25519Signature2020.should.exist;
    });
  });

  describe('sign() and verify()', () => {
    it('should sign a document', async () => {
      const unsignedCredential = {...credential};
      const keyPair = await Ed25519VerificationKey2020.from({...mockKey});
      const suite = new Ed25519Signature2020({key: keyPair});
      suite.date = '2010-01-01T19:23:24Z';

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        // eslint-disable-next-line max-len
        .equal('z3vG9cHevmrtMiTfb8e7qSPtKyZz1ziPbcxePqcYJ5Rtx5asWsHFq6rPfj8GaPxXkYqvb7qu2dFYg9amc1dpqQhsY');
    });
  });

  describe('verify()', () => {
    let signedCredential;

    before(async () => {
      const unsignedCredential = {...credential};
      const keyPair = await Ed25519VerificationKey2020.from({...mockKey});
      const suite = new Ed25519Signature2020({key: keyPair});
      suite.date = '2010-01-01T19:23:24Z';

      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
    });

    it('should verify a document', async () => {
      const keyPair = await Ed25519VerificationKey2020.from({...mockKey});
      const suite = new Ed25519Signature2020({key: keyPair});

      const result = await jsigs.verify(signedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        compactProof: false,
        documentLoader
      });

      expect(result.verified).to.be.true;
    });
  });
});
