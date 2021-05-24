/*
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
import {JsonLdDocumentLoader} from 'jsonld-document-loader';
import * as didKey from '@digitalbazaar/did-method-key';
import {CachedResolver} from '@digitalbazaar/did-io';
import {
  mockKeyPair2020,
  controllerDoc2020,
  mockPublicKey2020,
} from './mock-data.js';
import ed25519Context2020 from 'ed25519-signature-2020-context';
import ed25519Context2018 from 'ed25519-signature-2018-context';
import didContext from 'did-context';
import credContext from 'credentials-context';

export const loader = new JsonLdDocumentLoader();

const didKeyDriver = didKey.driver();
const resolver = new CachedResolver();
resolver.use(didKeyDriver);

loader.addStatic(mockKeyPair2020.controller, controllerDoc2020);
loader.addStatic(mockPublicKey2020.id, mockPublicKey2020);
loader.addStatic(ed25519Context2020.constants.CONTEXT_URL,
  ed25519Context2020.contexts.get(ed25519Context2020.constants.CONTEXT_URL));
loader.addStatic(ed25519Context2018.constants.CONTEXT_URL,
  ed25519Context2018.contexts.get(ed25519Context2018.constants.CONTEXT_URL));
loader.addStatic(didContext.constants.DID_CONTEXT_URL,
  didContext.contexts.get(didContext.constants.DID_CONTEXT_URL));
loader.addStatic(credContext.constants.CREDENTIALS_CONTEXT_V1_URL,
  credContext.contexts.get(credContext.constants.CREDENTIALS_CONTEXT_V1_URL));
loader.setDidResolver(resolver);
