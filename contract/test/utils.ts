// Test utilities for the Guestbook contract test suite.

import { randomBytes as nodeRandomBytes } from "node:crypto";

/**
 * Generates a cryptographically random byte array of the given length.
 * Used to create fake secret keys for simulator-based unit tests.
 */
export const randomBytes = (length: number): Uint8Array =>
  new Uint8Array(nodeRandomBytes(length));
