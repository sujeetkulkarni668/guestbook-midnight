// Guestbook Witnesses
// Implements the `witness localSecretKey(): Bytes<32>;` declared in guestbook.compact.
// Based on the Midnight example-bboard project.
export const createGuestbookPrivateState = (secretKey) => ({
    secretKey,
});
export const witnesses = {
    localSecretKey: ({ privateState, }) => [privateState, privateState.secretKey],
};
//# sourceMappingURL=witnesses.js.map