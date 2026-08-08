import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";
export * from "./managed/guestbook/contract/index.js";
export * from "./witnesses.js";
import * as CompiledGuestbookContract from "./managed/guestbook/contract/index.js";
import * as Witnesses from "./witnesses.js";
export declare const GuestbookContractInstance: CompiledContract.CompiledContract<CompiledGuestbookContract.Contract<Witnesses.GuestbookPrivateState, CompiledGuestbookContract.Witnesses<Witnesses.GuestbookPrivateState>>, Witnesses.GuestbookPrivateState, never>;
/**
 * Explicit, stable re-export of the Compact-generated ledger decoder so
 * consumers (shared/src/client.ts) don't have to guess whether it's a
 * standalone export or a static method on the generated contract class -
 * check `./managed/guestbook/contract/index.d.ts` after `npm run compact`
 * and adjust this line if the generated shape differs.
 */
export declare const ledger: typeof CompiledGuestbookContract.ledger;
