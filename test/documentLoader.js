/*
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
import {JsonLdDocumentLoader} from 'jsonld-document-loader';
import * as didKey from '@digitalbazaar/did-method-key';
import {CachedResolver} from '@digitalbazaar/did-io';
import {mockKeyPair, mockPublicKey, controllerDoc} from './mock-data.js';
import ed25519 from 'ed25519-signature-2020-context';
import didContext from 'did-context';
import credContext from 'credentials-context';

export const loader = new JsonLdDocumentLoader();

const didKeyDriver = didKey.driver();
const resolver = new CachedResolver();
resolver.use(didKeyDriver);

loader.addStatic(mockKeyPair.controller, controllerDoc);
loader.addStatic(mockPublicKey.id, mockPublicKey);
loader.addStatic(ed25519.constants.CONTEXT_URL,
  ed25519.contexts.get(ed25519.constants.CONTEXT_URL));
loader.addStatic(didContext.constants.DID_CONTEXT_URL,
  didContext.contexts.get(didContext.constants.DID_CONTEXT_URL));
loader.addStatic(credContext.constants.CREDENTIALS_CONTEXT_V1_URL,
  credContext.contexts.get(credContext.constants.CREDENTIALS_CONTEXT_V1_URL));
loader.setDidResolver(resolver);
