/*!
 * Copyright (c) 2020-2021 Digital Bazaar, Inc. All rights reserved.
 */
import jsonld from 'jsonld';
import jsigs from 'jsonld-signatures';
const {suites: {LinkedDataSignature}} = jsigs;
const base58btc = require('base58-universal');
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
    super({
      type: 'https://w3id.org/security#Ed25519Signature2020',
      alg: 'EdDSA', LDKeyClass: Ed25519VerificationKey2020, verificationMethod,
      signer, key, proof, date, useNativeCanonize
    });
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

  /**
   * Adds a signature (proofValue) field to the proof object. Called by
   * LinkedDataSignature.createProof().
   *
   * @param {Uint8Array} verifyData - Data to be signed.
   * @param {object} proof - Proof object (containing the proofPurpose,
   *   verificationMethod, etc).
   *
   * @returns {Promise<object>} Resolves with the proof containing the signature
   *   value.
   */
  async sign({verifyData, proof}) {
    if(!(this.signer && typeof this.signer.sign === 'function')) {
      throw new Error('A signer API has not been specified.');
    }
    const signatureBytes = await this.signer.sign({data: verifyData});

    // prefix with `z` to indicate multi-base base58btc encoding
    proof.proofValue = `z${base58btc.encode(signatureBytes)}`;
    return proof;
  }

  /**
   * Verifies the proof signature against the given data.
   *
   * @param {Uint8Array} verifyData - Canonicalized hashed data.
   * @param {object} verificationMethod - Key object.
   * @param {object} document - The document the proof applies to.
   * @param {object} proof - The proof to be verified.
   *
   * @returns {Promise<boolean>} Resolves with the verification result.
   */
  async verifySignature({verifyData, verificationMethod, proof}) {
    const {proofValue} = proof;
    if(!(proofValue && typeof proofValue === 'string')) {
      throw new TypeError(
        'The proof does not include a valid "proofValue" property.');
    }
    if(proofValue[0] !== 'z') {
      throw new Error('Only base58btc multibase encoding is supported.');
    }
    const signatureBytes = base58btc.decode(proofValue.substr(1));

    let {verifier} = this;
    if(!verifier) {
      const key = await this.LDKeyClass.from(verificationMethod);
      verifier = key.verifier();
    }
    return verifier.verify({data: verifyData, signature: signatureBytes});
  }

  async assertVerificationMethod({verificationMethod}) {
    if(!jsonld.hasValue(verificationMethod, 'type', this.requiredKeyType)) {
      throw new Error(
        `Invalid key type. Key type must be "${this.requiredKeyType}".`);
    }
  }

  async getVerificationMethod({proof, documentLoader}) {
    if(this.key) {
      return this.key.export({publicKey: true});
    }

    const verificationMethod = await super.getVerificationMethod(
      {proof, documentLoader});
    await this.assertVerificationMethod({verificationMethod});
    return verificationMethod;
  }

  async matchProof({proof, document, purpose, documentLoader, expansionMap}) {
    if(!await super.matchProof({proof, document, purpose, documentLoader,
      expansionMap})) {
      return false;
    }
    if(!this.key) {
      // no key specified, so assume this suite matches and it can be retrieved
      return true;
    }

    const {verificationMethod} = proof;

    // only match if the key specified matches the one in the proof
    if(typeof verificationMethod === 'object') {
      return verificationMethod.id === this.key.id;
    }
    return verificationMethod === this.key.id;
  }
}
