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
import {
  credential, mockKeyPair, mockPublicKey, controllerDoc
} from './mock-data.js';

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
          'https://w3id.org/security/suites/ed25519-2020/v1': ed25519
            .contexts.get('https://w3id.org/security/suites/ed25519-2020/v1')
        }
      })
      .addContext({
        [mockKeyPair.controller]: controllerDoc,
        [mockPublicKey.id]: mockPublicKey
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
      const keyPair = await Ed25519VerificationKey2020.from({...mockKeyPair});
      const suite = new Ed25519Signature2020({key: keyPair});
      suite.date = '2010-01-01T19:23:24Z';

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        .equal('zfMw453FJfB7c6Cx4Lo9dho8ePVnZrSwLeFAhUFPZXaS3pe1' +
          'nS7v3PXFNkxvK515eNweAEiCbtceWGYQyLjtD2uB');
    });
    it('should throw error if "signer" is not specified', async () => {
      const unsignedCredential = {...credential};
      const suite = new Ed25519Signature2020();
      let signedCredential;
      let err;
      try {
        signedCredential = await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        err = e;
      }
      expect(signedCredential).to.equal(undefined);
      expect(err.name).to.equal('Error');
      expect(err.message).to.equal('A signer API has not been specified.');
    });
  });

  describe('verify()', () => {
    let signedCredential;

    before(async () => {
      const unsignedCredential = {...credential};
      const keyPair = await Ed25519VerificationKey2020.from({...mockKeyPair});
      const suite = new Ed25519Signature2020({key: keyPair});
      suite.date = '2010-01-01T19:23:24Z';

      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
    });

    it.only('should verify a document', async () => {
      const suite = new Ed25519Signature2020();

      console.log(signedCredential)

      const result = await jsigs.verify(signedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      console.log(result)

      expect(result.verified).to.be.true;
    });
    it('should fail verification if "proofValue" is not string',
      async () => {
        const suite = new Ed25519Signature2020();
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        // intentionally modify proofValue type to not be string
        signedCredentialCopy.proof.proofValue = {};

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {error} = result.results[0];
        expect(result.verified).to.be.false;
        expect(error.name).to.equal('TypeError');
        expect(error.message).to.equal(
          'The proof does not include a valid "proofValue" property.'
        );
      });
    it('should fail verification if "proofValue" is not given',
      async () => {
        const suite = new Ed25519Signature2020();
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        // intentionally modify proofValue to be undefined
        signedCredentialCopy.proof.proofValue = undefined;

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {error} = result.results[0];

        expect(result.verified).to.be.false;
        expect(error.name).to.equal('TypeError');
        expect(error.message).to.equal(
          'The proof does not include a valid "proofValue" property.'
        );
      });
    it('should fail verification if proofValue string does not start with "z"',
      async () => {
        const suite = new Ed25519Signature2020();
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        // intentionally modify proofValue to not start with 'z'
        signedCredentialCopy.proof.proofValue = 'a';

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {errors} = result.error;

        expect(result.verified).to.be.false;
        expect(errors[0].name).to.equal('Error');
        expect(errors[0].message).to.equal(
          'Only base58btc multibase encoding is supported.'
        );
      });
    it('should fail verification if proof type is not Ed25519Signature2020',
      async () => {
        const suite = new Ed25519Signature2020();
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        // intentionally modify proof type to be Ed25519Signature2018
        signedCredentialCopy.proof.type = 'Ed25519Signature2018';

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {errors} = result.error;

        expect(result.verified).to.be.false;
        expect(errors[0].name).to.equal('Error');
        expect(errors[0].message).to.equal(
          'Could not verify any proofs; no proofs matched the required ' +
            'suite and purpose.');
      });
  });
});
