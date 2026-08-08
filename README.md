\# 📖 GuestBook dApp — Built on Midnight



> A privacy-first decentralized GuestBook powered by \*\*Midnight\*\*, \*\*Compact Smart Contracts\*\*, \*\*React\*\*, and \*\*TypeScript\*\*.

> Write a message on-chain while preserving user privacy through Midnight's confidential execution model.



\---



\## ✨ Overview



GuestBook is a minimal decentralized application demonstrating how to build privacy-preserving smart contracts on the Midnight Network.



Unlike traditional public blockchains, Midnight enables applications where sensitive user data remains confidential while smart contract logic stays verifiable.



This project is designed as an educational reference for developers learning the Midnight SDK and Compact language.



\---



\## 🚀 Features



\* 🔒 Privacy-first smart contract using Compact

\* ✍️ Submit guestbook messages securely

\* 👤 Ownership verified through witness-based signing

\* 🧹 Only the original signer can clear the guestbook

\* ⚛️ Modern React + TypeScript frontend

\* 🌐 Supports Midnight Preprod \& Preview networks

\* 🐳 Local Proof Server for development

\* 📦 Simple project structure for rapid onboarding



\---



\# 📂 Project Structure



```text

guestbook/

├── contract/          # Compact smart contract \& deployment scripts

├── shared/            # Wallet connector, network configuration, contract client

├── ui/                # React frontend

├── package.json

└── README.md

```



\---



\# 🛠️ Prerequisites



Before getting started, make sure you have:



\* Node.js 20+

\* npm

\* Docker Desktop

\* Lace Wallet

\* Midnight CLI \& Compact Compiler



\---



\# ⚡ Installation



Clone the repository and install dependencies.



```bash

npm install

```



Compile the Compact smart contract.



```bash

npm run compact

```



\---



\# 🧪 Start Local Proof Server



Launch the local proof server required by Midnight.



```bash

npm run proof:up

```



When you're finished:



```bash

npm run proof:down

```



\---



\# 💰 Create \& Fund Your Wallet



1\. Open \*\*Lace Wallet\*\*

2\. Switch to \*\*Preprod\*\* (recommended) or \*\*Preview\*\*

3\. Create a wallet

4\. Securely save your recovery phrase

5\. Copy your \*\*Unshielded Address\*\*

6\. Request faucet tokens for your selected network

7\. Delegate your \*\*tNIGHT\*\*

8\. Wait until \*\*tDUST\*\* becomes available before deployment



> \*\*Never commit your seed phrase or private keys to GitHub.\*\*



\---



\# 🚀 Deploy the Smart Contract



Navigate to the contract folder.



```bash

cd contract

```



Copy the environment template.



```bash

cp .env.preprod.example .env.preprod

```



Edit `.env.preprod` and configure \*\*one\*\* of the following:



```env

MIDNIGHT\_PREPROD\_SEED=



\# OR



MIDNIGHT\_PREPROD\_MNEMONIC=

```



Return to the project root and deploy.



```bash

cd ..

npm run deploy:preprod

```



Deployment prints the contract address.



Save it—you'll need it for the frontend.



\---



\# ⚙️ Configure the Frontend



Navigate to the UI.



```bash

cd ui

```



Create your environment file.



```bash

cp .env.example .env

```



Update it with your deployed contract.



```env

VITE\_NETWORK\_ID=preprod

VITE\_CONTRACT\_ADDRESS=<YOUR\_CONTRACT\_ADDRESS>

```



Return to the root directory.



```bash

cd ..

```



\---



\# ▶️ Run the Application



Development server



```bash

npm run dev

```



Production build



```bash

npm run build

```



The production output is generated inside:



```text

ui/dist

```



\---



\# 📜 Smart Contract



The GuestBook contract maintains a single guestbook entry.



\### Stored State



| Field          | Description                                |

| -------------- | ------------------------------------------ |

| `owner`        | Public key derived from the witness signer |

| `guestName`    | Name of the guest                          |

| `guestMessage` | Guest message                              |

| `state`        | `EMPTY` or `SIGNED`                        |



\### Access Control



\* Anyone can sign the guestbook.

\* Only the original signer can execute `clearGuestbook()`.

\* Private keys are never revealed to the contract.



\---



\# 🔐 Privacy Model



Midnight separates \*\*verification\*\* from \*\*data disclosure\*\*.



The contract validates ownership using witness-generated proofs while keeping private signing data confidential.



This allows decentralized applications that provide blockchain security without exposing sensitive user information.



\---



\# 📦 Available Scripts



| Command                  | Description                         |

| ------------------------ | ----------------------------------- |

| `npm install`            | Install project dependencies        |

| `npm run compact`        | Compile Compact contract            |

| `npm run proof:up`       | Start local proof server            |

| `npm run proof:down`     | Stop proof server                   |

| `npm run deploy:preprod` | Deploy contract to Midnight Preprod |

| `npm run dev`            | Start React development server      |

| `npm run build`          | Build production frontend           |



\---



\# 🏗️ Technology Stack



\* \*\*Midnight Network\*\*

\* \*\*Compact Smart Contracts\*\*

\* \*\*TypeScript\*\*

\* \*\*React\*\*

\* \*\*Vite\*\*

\* \*\*Docker\*\*

\* \*\*Node.js\*\*



\---



\# 🎯 Learning Objectives



This project demonstrates how to:



\* Build confidential smart contracts with Compact

\* Connect React applications to Midnight

\* Deploy contracts to the Preprod network

\* Manage wallet authentication securely

\* Implement ownership-based authorization

\* Use Midnight's local proof infrastructure



\---



\# 🤝 Contributing



Contributions are welcome.



1\. Fork the repository

2\. Create a feature branch

3\. Commit your changes

4\. Open a Pull Request



\---



\# 📄 License



This project is licensed under the \*\*MIT License\*\*.



\---



<div align="center">



\### Built with ❤️ on Midnight



\*Private by Design. Decentralized by Default.\*



</div>



