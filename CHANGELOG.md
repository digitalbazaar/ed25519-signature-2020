# @digitalbazaar/ed25519-signature-2020 Changelog

## 2.0.0 -

### Changed
- **BREAKING**: Update to use `jsonld-signatures` v9.0 (removes 
  `verificationMethod` suite constructor param, makes key and signer validation
  stricter).
- Fix initializing signer and verifier object by passing it to superclass.

## 1.0.0 - 2021-03-19

### Added
- Initial files.
