/**
 * Headless CLI deploy script for the Guestbook contract.
 *
 * Deploys once per environment (Preview / Preprod / Mainnet) using a
 * wallet built from a seed/mnemonic you control - NOT the browser Lace
 * wallet. Run this from your own machine; never paste your seed phrase
 * into a chat, ticket, or commit it to git (.env.<network> is gitignored).
 *
 * Usage:
 *   1. cp .env.preprod.example .env.preprod   (create this file yourself)
 *      and set MIDNIGHT_PREPROD_SEED=<64 hex chars>
 *      or     MIDNIGHT_PREPROD_MNEMONIC=word1 word2 ... word24
 *      (set only ONE of the two)
 *   2. Fund that wallet: get tNIGHT from the Preprod faucet, then
 *      delegate it in your wallet to start generating tDUST.
 *      https://docs.midnight.network/guides/acquire-tokens
 *   3. Start the local proof server (Docker):
 *      docker run -p 6300:6300 midnightnetwork/proof-server -- \
 *        'midnight-proof-server --network testnet'
 *   4. npm run compact --workspace=contract   (compiles the contract)
 *   5. npx tsx contract/deploy/deploy.ts preprod
 *
 * This follows the same pattern as Midnight's official example CLIs
 * (bboard-cli / hello-world). If any import below doesn't resolve after
 * `npm install`, check `node_modules/@midnight-ntwrk/wallet`'s current
 * exports - this SDK is under active development and package names /
 * WalletBuilder options have shifted between releases. The official,
 * always-up-to-date reference is:
 * https://docs.midnight.network/guides/deploy-mn-app
 */

import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import type { Wallet } from "@midnight-ntwrk/wallet-api";

import { GuestbookContractInstance, createGuestbookPrivateState } from "../src/index.js";

type Network = "preview" | "preprod" | "mainnet";

const ENDPOINTS: Record<Network, { indexer: string; indexerWs: string; node: string }> = {
  preview: {
    indexer: "https://indexer.preview.midnight.network/api/v3/graphql",
    indexerWs: "wss://indexer.preview.midnight.network/api/v3/graphql/ws",
    node: "https://rpc.preview.midnight.network",
  },
  preprod: {
    indexer: "https://indexer.preprod.midnight.network/api/v3/graphql",
    indexerWs: "wss://indexer.preprod.midnight.network/api/v3/graphql/ws",
    node: "https://rpc.preprod.midnight.network",
  },
  mainnet: {
    indexer: "https://indexer.midnight.network/api/v3/graphql",
    indexerWs: "wss://indexer.midnight.network/api/v3/graphql/ws",
    node: "https://rpc.midnight.network",
  },
};

const PROOF_SERVER = "http://127.0.0.1:6300";

async function main() {
  const network = (process.argv[2] as Network) ?? "preprod";
  if (!ENDPOINTS[network]) {
    console.error(`Unknown network "${network}". Use preview, preprod, or mainnet.`);
    process.exit(1);
  }

  const seed = process.env[`MIDNIGHT_${network.toUpperCase()}_SEED`];
  const mnemonic = process.env[`MIDNIGHT_${network.toUpperCase()}_MNEMONIC`];

  if (!seed && !mnemonic) {
    console.error(
      `Set MIDNIGHT_${network.toUpperCase()}_SEED or MIDNIGHT_${network.toUpperCase()}_MNEMONIC ` +
        `in .env.${network} (see contract/deploy/deploy.ts header comment).`
    );
    process.exit(1);
  }
  if (seed && mnemonic) {
    console.error(`Set only ONE of SEED or MNEMONIC for ${network}, not both.`);
    process.exit(1);
  }

  setNetworkId(network);
  const endpoints = ENDPOINTS[network];

  console.log(`Building wallet for ${network}...`);
  const wallet: Wallet = seed
    ? await WalletBuilder.buildFromSeed(
        endpoints.indexer,
        endpoints.indexerWs,
        PROOF_SERVER,
        endpoints.node,
        seed,
        network
      )
    : await WalletBuilder.buildFromMnemonic(
        endpoints.indexer,
        endpoints.indexerWs,
        PROOF_SERVER,
        endpoints.node,
        mnemonic!,
        network
      );

  wallet.start();
  console.log("Syncing wallet with the network (this can take a while on a fresh wallet)...");

  const state = await wallet.state();
  console.log(`Wallet address: ${state.address}`);
  console.log(`Wallet balance: ${state.balances ? JSON.stringify(state.balances) : "unknown"}`);
  console.log(
    "If balance is 0, fund this address from the faucet and re-run: " +
      "https://docs.midnight.network/guides/acquire-tokens"
  );

  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "guestbook-deploy-private-state",
    }),
    publicDataProvider: indexerPublicDataProvider(endpoints.indexer, endpoints.indexerWs),
    proofProvider: httpClientProofProvider(PROOF_SERVER),
    zkConfigProvider: new NodeZkConfigProvider(
      new URL("../dist/managed/guestbook", import.meta.url).pathname
    ),
    walletProvider: wallet,
  };

  console.log("Deploying Guestbook contract...");
  const secretKey = crypto.getRandomValues(new Uint8Array(32));

  const deployed = await deployContract(providers as never, {
    compiledContract: GuestbookContractInstance,
    privateStateId: "guestbookPrivateState",
    initialPrivateState: createGuestbookPrivateState(secretKey),
  });

  const address = deployed.deployTxData.public.contractAddress;
  console.log("\n✅ Deployed Guestbook contract at address:");
  console.log(address);
  console.log(`\nPut this in ui/.env as:\nVITE_CONTRACT_ADDRESS=${address}\nVITE_NETWORK_ID=${network}`);

  await wallet.close();
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
