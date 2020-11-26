/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
export const nodejs = (
  typeof process !== 'undefined' && process.versions && process.versions.node);

export const browser = !nodejs &&
  (typeof window !== 'undefined' || typeof self !== 'undefined');
