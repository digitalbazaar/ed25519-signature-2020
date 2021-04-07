# Ed25519Signature2020 suite _(@digitalbazaar/ed25519-signature-2020)_

[![Build status](https://img.shields.io/github/workflow/status/digitalbazaar/ed25519-signature-2020/Node.js%20CI)](https://github.com/digitalbazaar/ed25519-signature-2020/actions?query=workflow%3A%22Node.js+CI%22)
[![Coverage status](https://img.shields.io/codecov/c/github/digitalbazaar/ed25519-signature-2020)](https://codecov.io/gh/digitalbazaar/ed25519-signature-2020)
[![NPM Version](https://img.shields.io/npm/v/@digitalbazaar/ed25519-signature-2020.svg)](https://npm.im/digitalbazaar/ed25519-signature-2020)

> Ed25519Signature2020 Linked Data Proof suite for use with jsonld-signatures.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

For use with https://github.com/digitalbazaar/jsonld-signatures v9.0 and above.

## Security

TBD

## Install

- Node.js 14+ is required.

To install locally (for development):

```
git clone https://github.com/digitalbazaar/ed25519-signature-2020.git
cd ed25519-signature-2020
npm install
```

## Usage

Example signed VC:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://w3id.org/security/ed25519-signature-2020/v1"
  ],
  "id": "http://example.edu/credentials/1872",
  "type": [
    "VerifiableCredential",
    "AlumniCredential"
  ],
  "issuer": "https://example.edu/issuers/565049",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "https://example.edu/students/alice",
    "alumniOf": "Example University"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2010-01-01T19:23:24Z",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3vG9cHevmrtMiTfb8e7qSPtKyZz1ziPbcxePqcYJ5Rtx5asWsHFq6rPfj8GaPxXkYqvb7qu2dFYg9amc1dpqQhsY",
    "verificationMethod": "https://example.edu/issuers/565049#z6MkjLrk3gKS2nnkeWcmcxiZPGskmesDpuwRBorgHxUXfxnG"
  }
}
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © 2020 Digital Bazaar
