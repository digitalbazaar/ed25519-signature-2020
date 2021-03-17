/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
export const controller = 'https://example.edu/issuers/565049';

export const mockKey = {
  type: 'Ed25519VerificationKey2020',
  controller,
  id: controller + '#z6MkjLrk3gKS2nnkeWcmcxiZPGskmesDpuwRBorgHxUXfxnG',
  publicKeyMultibase: 'zEYJrMxWigf9boyeJMTRN4Ern8DJMoCXaLK77pzQmxVjf',
  privateKeyMultibase: 'z4E7Q4neNHwv3pXUNzUjzc6TTYspqn9Aw6vakpRKpbVrCzwKWD4hQ' +
    'DHnxuhfrTaMjnR8BTp9NeUvJiwJoSUM6xHAZ'
};

export const controllerDoc = {
  '@context': [
    'https://w3id.org/security/v2'
  ],
  id: 'https://example.edu/issuers/565049',
  assertionMethod: [mockKey.id]
};

export const credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
    'https://w3id.org/security/suites/ed25519-2020/v1'
  ],
  id: 'http://example.edu/credentials/1872',
  type: ['VerifiableCredential', 'AlumniCredential'],
  issuer: 'https://example.edu/issuers/565049',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    id: 'https://example.edu/students/alice',
    alumniOf: 'Example University'
  }
};
