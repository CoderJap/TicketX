# TicketX 🎟️

TicketX is a blockchain-powered ticketing platform that leverages NFTs to revolutionize event ticketing. Built using Solidity smart contracts and ERC standards, it ensures secure, verifiable, and tamper-proof ticket transactions.

## 🚀 Features

- 🎫 **NFT Ticketing** - Mint event tickets as NFTs to ensure authenticity.
- 🔒 **Secure & Transparent** - Built on blockchain to prevent ticket fraud.
- ⛓ **ERC Standards** - Implements ERC-721/ERC-1155 for NFT-based tickets.
- 🏦 **Crypto Payments** - Accept payments in cryptocurrency.
- 🛠 **Smart Contract Automation** - Handles ownership, transfers, and validation.
- 🎭 **MetaMask Integration** - Allows seamless interaction with blockchain wallets.

## 🛠 Tech Stack

- **Solidity** - Smart contract development
- **JavaScript** - Frontend & testing
- **[Hardhat](https://hardhat.org/)** - Smart contract development framework
- **[Ethers.js](https://docs.ethers.io/v5/)** - Blockchain interaction
- **[React.js](https://reactjs.org/)** - Frontend framework
- **[MetaMask](https://metamask.io/)** - Web3 authentication

## 📂 Project Structure

```
TicketX/
│-- contracts/          # Solidity smart contracts
│-- frontend/           # React.js frontend
│-- scripts/            # Deployment & interaction scripts
│-- test/               # Smart contract testing
│-- hardhat.config.js   # Hardhat configuration
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- Hardhat
- MetaMask (browser extension)

### Installation

Clone the repository:

```sh
git clone https://github.com/CoderJap/TicketX.git
cd TicketX
```

Install dependencies:

```sh
npm install
```

### Smart Contract Deployment

Compile the smart contracts:

```sh
npx hardhat compile
```

Deploy contracts to a local Hardhat network:

```sh
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Running the Frontend

```sh
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.

## 📜 License

This project is licensed under the MIT License.

---

Made with ❤️ by [CoderJap](https://github.com/CoderJap)
