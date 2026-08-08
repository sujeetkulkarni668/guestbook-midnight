import { Ledger } from "./managed/guestbook/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
export type GuestbookPrivateState = {
    readonly secretKey: Uint8Array;
};
export declare const createGuestbookPrivateState: (secretKey: Uint8Array) => GuestbookPrivateState;
export declare const witnesses: {
    localSecretKey: ({ privateState, }: WitnessContext<Ledger, GuestbookPrivateState>) => [GuestbookPrivateState, Uint8Array];
};
