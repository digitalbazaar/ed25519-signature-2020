/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import jsigs from 'jsonld-signatures';
const {suites: {LinkedDataSignature}} = jsigs;
import {
  Ed25519VerificationKey2020
} from '@digitalbazaar/ed25519-verification-key-2020';

export class Ed25519Signature2020 extends LinkedDataSignature {
  /**
   * @param {object} options - Options hashmap.
   * @param {string} [options.verificationMethod] - A key id URL to the paired
   *   public key.
   * @param {Function} [options.signer] - Signer function.
   *
   * Advanced optional parameters and overrides:
   *
   * @param {object} [options.key] - An optional crypto-ld KeyPair.
   * @param {object} [options.proof] - A JSON-LD document with options to use
   *   for the `proof` node (e.g. any other custom fields can be provided here
   *   using a context different from security-v2).
   * @param {string|Date} [options.date] - Signing date to use if not passed.
   * @param {boolean} [options.useNativeCanonize] - Whether to use a native
   *   canonize algorithm.
   */
  constructor({
    signer, verificationMethod, key, proof, date, useNativeCanonize
  } = {}) {
    super({type: 'Ed25519Signature2020', alg: 'EdDSA',
      LDKeyClass: Ed25519VerificationKey2020, verificationMethod, signer,
      key, proof, date, useNativeCanonize});
    this.requiredKeyType = 'Ed25519VerificationKey2020';

    if(key) {
      if(verificationMethod === undefined) {
        this.verificationMethod = key.id;
      }
      this.key = key;
      if(typeof key.signer === 'function') {
        this.signer = key.signer();
      }
      if(typeof key.verifier === 'function') {
        this.verifier = key.verifier();
      }
    }
  }
}
