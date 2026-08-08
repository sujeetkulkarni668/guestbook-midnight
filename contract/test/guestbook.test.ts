import { GuestbookSimulator } from "./guestbook-simulator.js";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { describe, it, expect } from "vitest";
import { randomBytes } from "./utils.js";
import { State } from "../src/managed/guestbook/contract/index.js";

setNetworkId("undeployed");

describe("Guestbook Smart Contract", () => {
  it("generates deterministic initial ledger state", () => {
    const key = randomBytes(32);

    const simulator0 = new GuestbookSimulator(key);
    const simulator1 = new GuestbookSimulator(key);

    expect(simulator0.getLedger()).toEqual(simulator1.getLedger());
  });

  it("initializes correctly", () => {
    const simulator = new GuestbookSimulator(randomBytes(32));

    const ledger = simulator.getLedger();

    expect(ledger.sequence).toEqual(1n);
    expect(ledger.state).toEqual(State.EMPTY);

    expect(ledger.guestName.is_some).toEqual(false);
    expect(ledger.guestName.value).toEqual("");

    expect(ledger.guestMessage.is_some).toEqual(false);
    expect(ledger.guestMessage.value).toEqual("");

    expect(ledger.owner).toEqual(new Uint8Array(32));
  });

  it("allows a user to sign the guestbook", () => {
    const simulator = new GuestbookSimulator(randomBytes(32));

    simulator.signGuestbook(
      "Sujeet",
      "Hello Midnight!"
    );

    const ledger = simulator.getLedger();

    expect(ledger.state).toEqual(State.SIGNED);
    expect(ledger.guestName.value).toEqual("Sujeet");
    expect(ledger.guestMessage.value).toEqual("Hello Midnight!");
    expect(ledger.owner).toEqual(simulator.publicKey());
  });

  it("allows the owner to clear the guestbook", () => {
    const simulator = new GuestbookSimulator(randomBytes(32));

    simulator.signGuestbook(
      "Alice",
      "Testing Guestbook"
    );

    simulator.clearGuestbook();

    const ledger = simulator.getLedger();

    expect(ledger.state).toEqual(State.EMPTY);
    expect(ledger.sequence).toEqual(2n);

    expect(ledger.guestName.is_some).toEqual(false);
    expect(ledger.guestMessage.is_some).toEqual(false);
  });

  it("prevents signing twice", () => {
    const simulator = new GuestbookSimulator(randomBytes(32));

    simulator.signGuestbook("Alice", "First");

    expect(() =>
      simulator.signGuestbook("Bob", "Second")
    ).toThrow();
  });

  it("prevents another user from clearing the guestbook", () => {
    const simulator = new GuestbookSimulator(randomBytes(32));

    simulator.signGuestbook(
      "Alice",
      "Secret Message"
    );

    simulator.switchUser(randomBytes(32));

    expect(() =>
      simulator.clearGuestbook()
    ).toThrow();
  });
});