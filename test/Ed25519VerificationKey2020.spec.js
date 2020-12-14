/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;
import securityV3 from './security-v3.js';

import chai from 'chai';
chai.should();
const {expect} = chai;

import {Ed25519VerificationKey2020} from
  '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020} from '../';
import {credential, mockKey, controllerDoc} from './mock-data.js';

import {
  documentLoaderFactory,
  contexts,
} from '@transmute/jsonld-document-loader';

// const securityV1 = contexts
//   .W3ID_Security_Vocabulary['https://w3id.org/security/v1'];
const securityV2 = contexts
  .W3ID_Security_Vocabulary['https://w3id.org/security/v2'];
// // Hideously modify to include this new Ed25519Signature2020 suite
// securityV1['@context'].Ed25519Signature2020 =
//   securityV1['@context'].Ed25519Signature2018;

const documentLoader = documentLoaderFactory.pluginFactory
  .build({
    contexts: {
      ...contexts.W3C_Verifiable_Credentials,
      // ...contexts.W3ID_Security_Vocabulary,
      // 'https://w3id.org/security/v1': securityV1,
      'https://w3id.org/security/v2': securityV2,
      'https://w3id.org/security/v3': securityV3
    },
  })
  // .addContext(contexts.W3C_Decentralized_Identifiers)
  .addContext({
    [mockKey.controller]: controllerDoc
  })
  .buildDocumentLoader();

// const vc = require('vc-js');
// // vc-js exports its own secure documentLoader.
// const {defaultDocumentLoader} = vc;
// // a valid json-ld @context.
// const myCustomContext = require('./myCustomContext');
//
// const documentLoader = extendContextLoader(async url => {
//   if(url === 'did:test:context:foo') {
//     return {
//       contextUrl: null,
//       documentUrl: url,
//       document: myCustomContext
//     };
//   }
//   return defaultDocumentLoader(url);
// });

describe('Ed25519Signature2020', () => {
  describe('constructor', () => {
    it('should exist', async () => {
      Ed25519Signature2020.should.exist;
    });
  });

  describe('sign()', () => {
    it('should sign a document', async () => {
      const key = await Ed25519VerificationKey2020.from({...mockKey});
      const signed = await jsigs.sign(credential, {
        suite: new Ed25519Signature2020({key}),
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      console.log('Signed document:', signed);

      expect(signed).to.have.property('proof');
      expect(signed.proof.proofValue).to
        .equal('z5jdt64Lg9q7SqiCpnNDgNmGmwHrTYj6jTGS7xVQuYpBFfjNUtrVMfa3UobwWKRS7UVJcSivxB4T4Sr9QmmHpxy84');
    });
  });

  describe('verify()', () => {});
});
