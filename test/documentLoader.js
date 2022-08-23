/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {
  controllerDoc2020,
  mockKeyPair2020,
  mockPublicKey2020,
} from './mock-data.js';
import ed25519Context2018 from 'ed25519-signature-2018-context';
import {securityLoader} from '@digitalbazaar/security-document-loader';

export const loader = securityLoader();

loader.addStatic(mockKeyPair2020.controller, controllerDoc2020);
loader.addStatic(mockPublicKey2020.id, mockPublicKey2020);
loader.addStatic(ed25519Context2018.constants.CONTEXT_URL,
  ed25519Context2018.contexts.get(ed25519Context2018.constants.CONTEXT_URL));
