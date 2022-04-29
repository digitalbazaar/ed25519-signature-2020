/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {expect} from 'chai';

import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;

import {
  Ed25519VerificationKey2020
} from '@digitalbazaar/ed25519-verification-key-2020';

import {
  Ed25519VerificationKey2018
} from '@digitalbazaar/ed25519-verification-key-2018';
import {Ed25519Signature2020, suiteContext} from '../lib/index.js';
import {
  credential,
  mockKeyPair2020,
  mockKeyPair2018,
  mockPublicKey2018,
  controllerDoc2018
} from './mock-data.js';
import {loader} from './documentLoader.js';

const documentLoader = loader.build();

describe('Ed25519Signature2020', () => {
  describe('exports', () => {
    it('it should have proper exports', async () => {
      should.exist(Ed25519Signature2020);
      should.exist(suiteContext);
      suiteContext.should.have.keys([
        'appContextMap',
        'constants',
        'contexts',
        'documentLoader',
        'CONTEXT',
        'CONTEXT_URL'
      ]);
      should.exist(Ed25519Signature2020.CONTEXT_URL);
      Ed25519Signature2020.CONTEXT_URL.should
        .equal(suiteContext.constants.CONTEXT_URL);
      const context = Ed25519Signature2020.CONTEXT;
      context.should.exist;
      context['@context'].id.should.equal('@id');
    });
  });

  describe('sign() and verify()', () => {
    it('should sign a document with a key pair', async () => {
      const unsignedCredential = {...credential};
      const keyPair = await Ed25519VerificationKey2020.from({
        ...mockKeyPair2020
      });
      const suite = new Ed25519Signature2020({key: keyPair});
      suite.date = '2010-01-01T19:23:24Z';

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        .equal('z3MvGcVxzRzzpKF1HA11EjvfPZsN8NAb7kXBRfeTm3CBg2gcJLQM5hZNmj6Cc' +
          'd9Lk4C1YueiFZvkSx4FuHVYVouQk');
    });

    it('signs a document given a signer object', async () => {
      const unsignedCredential = {...credential};
      const keyPair = await Ed25519VerificationKey2020.from({
        ...mockKeyPair2020
      });

      // Note: Typically a signer object comes from a KMS; mocking it here
      const signer = keyPair.signer();

      const suite = new Ed25519Signature2020({signer});
      suite.date = '2010-01-01T19:23:24Z';

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      expect(signedCredential).to.have.property('proof');
      expect(signedCredential.proof.proofValue).to
        .equal('z3MvGcVxzRzzpKF1HA11EjvfPZsN8NAb7kXBRfeTm3CBg2gcJLQM5hZNmj6Cc' +
          'd9Lk4C1YueiFZvkSx4FuHVYVouQk');
    });

    it('should throw error if "signer" is not specified', async () => {
      const unsignedCredential = {...credential};
      let signedCredential;
      // No key, no signer object given
      const suite = new Ed25519Signature2020();
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

    it('should add the suite context by default', async () => {
      const unsignedCredential = {...credential};
      unsignedCredential['@context'] = [
        'https://www.w3.org/2018/credentials/v1',
        {
          AlumniCredential: 'https://schema.org#AlumniCredential',
          alumniOf: 'https://schema.org#alumniOf'
        }
        // do not include the suite-specific context
      ];

      const keyPair = await Ed25519VerificationKey2020.from({
        ...mockKeyPair2020
      });
      const suite = new Ed25519Signature2020({key: keyPair});

      const signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      expect(signedCredential['@context']).to.eql([
        'https://www.w3.org/2018/credentials/v1',
        {
          AlumniCredential: 'https://schema.org#AlumniCredential',
          alumniOf: 'https://schema.org#alumniOf'
        },
        'https://w3id.org/security/suites/ed25519-2020/v1'
      ]);
    });

    it('should error if no context and addSuiteContext false', async () => {
      const unsignedCredential = {...credential};
      unsignedCredential['@context'] = [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
        // do not include the suite-specific context
      ];

      const keyPair = await Ed25519VerificationKey2020.from({
        ...mockKeyPair2020
      });
      const suite = new Ed25519Signature2020({key: keyPair});

      let err;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader,
          addSuiteContext: false
        });
      } catch(e) {
        err = e;
      }
      expect(err.name).to.equal('TypeError');
      expect(err.message).to
        .match(/The document to be signed must contain this suite's @context/);
    });
  });

  describe('verify() 2020 key type', () => {
    let signedCredential;

    before(async () => {
      const unsignedCredential = {...credential};
      const keyPair = await Ed25519VerificationKey2020.from({
        ...mockKeyPair2020
      });
      const suite = new Ed25519Signature2020({key: keyPair});
      suite.date = '2010-01-01T19:23:24Z';

      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
    });

    it('should verify a document', async () => {
      const suite = new Ed25519Signature2020();
      const result = await jsigs.verify(signedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
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
        expect(errors[0].name).to.equal('NotFoundError');
      });
  });
  describe('verify() 2018 key type', () => {
    let signedCredential;

    before(async () => {
      const unsignedCredential = {...credential};
      const keyPair = await Ed25519VerificationKey2018.from({
        ...mockKeyPair2018
      });
      const suite = new Ed25519Signature2020({key: keyPair});
      suite.date = '2010-01-01T19:23:24Z';

      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
    });

    it('should verify when verificationMethod contains 2018 key and context',
      async () => {
        loader.addStatic(mockKeyPair2018.controller, controllerDoc2018);
        loader.addStatic(mockPublicKey2018.id, mockPublicKey2018);
        const documentLoader = loader.build();
        const suite = new Ed25519Signature2020();
        const result = await jsigs.verify(signedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
        expect(result.verified).to.be.true;
      });
    it('should throw error when verification method does not have' +
      '2018 context', async () => {
      const mockPublicKey2018WithoutContext = {...mockPublicKey2018};
      // intentionally delete the context
      delete mockPublicKey2018WithoutContext['@context'];
      loader.addStatic(mockKeyPair2018.controller, controllerDoc2018);
      loader.addStatic(mockPublicKey2018WithoutContext.id,
        mockPublicKey2018WithoutContext);
      const documentLoader = loader.build();
      const suite = new Ed25519Signature2020();
      const result = await jsigs.verify(signedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(result.verified).to.be.false;
      expect(result.results[0].error.name).equal('TypeError');
      expect(result.results[0].error.message).equal(
        'The verification method (key) must contain ' +
        '\"https://w3id.org/security/suites/ed25519-2018/v1\" context.');
    });
    it('should throw error when verification method contains 2018 key' +
      'but 2020 context', async () => {
      const mockPublicKey2018With2020Context = {...mockPublicKey2018};
      // intentionally modify the context to ed25519 2020 context
      mockPublicKey2018With2020Context['@context'] =
        'https://w3id.org/security/suites/ed25519-2020/v1';
      loader.addStatic(mockKeyPair2018.controller, controllerDoc2018);
      loader.addStatic(mockPublicKey2018With2020Context.id,
        mockPublicKey2018With2020Context);
      const documentLoader = loader.build();
      const suite = new Ed25519Signature2020();
      const result = await jsigs.verify(signedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
      expect(result.verified).to.be.false;
      expect(result.results[0].error.name).equal('TypeError');
      expect(result.results[0].error.message).equal(
        'The verification method (key) must contain ' +
        '\"https://w3id.org/security/suites/ed25519-2018/v1\" context.');
    });
  });
});
