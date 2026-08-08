// Guestbook Witnesses
// Implements the `witness localSecretKey(): Bytes<32>;` declared in guestbook.compact.
// Based on the Midnight example-bboard project.

import { Ledger } from "./managed/guestbook/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type GuestbookPrivateState = {
  readonly secretKey: Uint8Array;
};

export const createGuestbookPrivateState = (
  secretKey: Uint8Array
): GuestbookPrivateState => ({
  secretKey,
});

export const witnesses = {
  localSecretKey: ({
    privateState,
  }: WitnessContext<Ledger, GuestbookPrivateState>): [
    GuestbookPrivateState,
    Uint8Array,
  ] => [privateState, privateState.secretKey],
};
