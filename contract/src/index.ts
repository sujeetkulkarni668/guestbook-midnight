// Guestbook Contract Entry Point
// Adapted from the Midnight example-bboard project.

import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/guestbook/contract/index.js";
export * from "./witnesses.js";

import * as CompiledGuestbookContract from "./managed/guestbook/contract/index.js";
import * as Witnesses from "./witnesses.js";

export const GuestbookContractInstance = CompiledContract.make<
  CompiledGuestbookContract.Contract<Witnesses.GuestbookPrivateState>
>(
  "Guestbook",
  CompiledGuestbookContract.Contract<Witnesses.GuestbookPrivateState>
).pipe(
  CompiledContract.withWitnesses(Witnesses.witnesses),
  CompiledContract.withCompiledFileAssets("./managed/guestbook"),
);

/**
 * Explicit, stable re-export of the Compact-generated ledger decoder so
 * consumers (shared/src/client.ts) don't have to guess whether it's a
 * standalone export or a static method on the generated contract class -
 * check `./managed/guestbook/contract/index.d.ts` after `npm run compact`
 * and adjust this line if the generated shape differs.
 */
export const ledger = CompiledGuestbookContract.ledger;
