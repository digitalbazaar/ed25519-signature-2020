/*
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
import {jsonLdDocumentLoader} from 'bedrock-jsonld-document-loader';
import * as didKey from '@digitalbazaar/did-method-key';
import {CachedResolver} from '@digitalbazaar/did-io';
import {mockKeyPair, mockPublicKey, controllerDoc} from './mock-data.js';

const didKeyDriver = didKey.driver();
const resolver = new CachedResolver();
resolver.use(didKeyDriver);

jsonLdDocumentLoader.addStatic(mockKeyPair.controller, controllerDoc);
jsonLdDocumentLoader.addStatic(mockPublicKey.id, mockPublicKey);
jsonLdDocumentLoader.setDidResolver(resolver);
