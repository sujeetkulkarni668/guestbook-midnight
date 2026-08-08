// Guestbook Simulator
// Drives the compiled contract's circuits off-chain (no proof server / node
// required) so the contract logic can be unit tested directly.
// Based on the Midnight example-bboard project's bboard-simulator.ts.

import {
  type CircuitContext,
  QueryContext,
  constructorContext,
  sampleContractAddress,
  convert_bigint_to_Uint8Array,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger,
} from "../src/managed/guestbook/contract/index.js";
import { type GuestbookPrivateState, witnesses } from "../src/witnesses.js";

export class GuestbookSimulator {
  readonly contract: Contract<GuestbookPrivateState>;
  circuitContext: CircuitContext<GuestbookPrivateState>;

  constructor(secretKey: Uint8Array) {
    this.contract = new Contract<GuestbookPrivateState>(witnesses);

    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      constructorContext({ secretKey }, "0".repeat(64))
    );

    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      originalState: currentContractState,
      transactionContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress()
      ),
    };
  }

  /** Returns the current public ledger state. */
  public getLedger(): Ledger {
    return ledger(this.circuitContext.originalState.data);
  }

  /** Returns the current local private state. */
  public getPrivateState(): GuestbookPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  /** Simulates a different user taking over the session (new secret key). */
  public switchUser(secretKey: Uint8Array): void {
    this.circuitContext = {
      ...this.circuitContext,
      currentPrivateState: { secretKey },
    };
  }

  /** Calls the `signGuestbook` circuit. */
  public signGuestbook(name: string, message: string): Ledger {
    this.circuitContext = this.contract.impureCircuits.signGuestbook(
      this.circuitContext,
      name,
      message
    ).context;

    return this.getLedger();
  }

  /** Calls the `clearGuestbook` circuit. */
  public clearGuestbook(): Ledger {
    this.circuitContext = this.contract.impureCircuits.clearGuestbook(
      this.circuitContext
    ).context;

    return this.getLedger();
  }

  /**
   * Convenience wrapper around the pure `publicKey` circuit: computes the
   * commitment for the currently active secret key against the current
   * ledger sequence number (mirrors what `signGuestbook`/`clearGuestbook`
   * compute internally).
   */
  public publicKey(): Uint8Array {
    const currentLedger = this.getLedger();
    const sequenceBytes = convert_bigint_to_Uint8Array(
      32,
      currentLedger.sequence
    );

    return this.contract.circuits.publicKey(
      this.circuitContext,
      this.circuitContext.currentPrivateState.secretKey,
      sequenceBytes
    ).result;
  }
}
