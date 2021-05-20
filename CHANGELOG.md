# @digitalbazaar/ed25519-signature-2020 Changelog

## 2.2.0 - 2021-05-TBD

### Changed
- Replace `@transmute/jsonld-document-loader` with `bedrock-jsonld-document-loader` in test.

## 2.1.0 - 2021-04-09

### Added
- Export the suite's context (and related objects such as context url,
  documentLoader, etc), and also set them as a property of the suite class.
- Set the `contextUrl` property on suite instance, to support context
  enforcement during the `sign()` operation that was added to `jsonld-signatures`
  `v9.0.1`.

## 2.0.1 - 2021-04-09

### Changed
- Use `ed25519-verification-key-2020@2.1.1`. Signer now has an "id" property.

## 2.0.0 - 2021-04-06

### Changed
- **BREAKING**: Update to use `jsonld-signatures` v9.0 (removes
  `verificationMethod` suite constructor param, makes key and signer validation
  stricter).
- Fix initializing signer and verifier object by passing it to superclass.

## 1.0.0 - 2021-03-19

### Added
- Initial files.
