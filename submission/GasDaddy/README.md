# 🚀 EIP-7702 Casual Hackathon Project Demo Submission

<!--
Please fill out the information below. This information will be automatically processed.
Do not remove the --- markers or change the field names.
-->

---

## 📋 Project Information (required)

```yaml
project_name: 'GasDaddy' # Your project name
description: 'Oh Daddy, please pay for my gas fee, thanks.' # Brief description of your project
```

## 👥 Team Information (required)

```yaml
team_members: ['Bruce', 'nonso7'] # List of team members' usernames, e.g. ["alice", "bob"]
```

## 🔍 Additional Information (optional)

```yaml
presentation_link: '' # Link to your presentation slides or video
notes: '' # Any additional information about your project
```

---

<!-- Do not edit below this line. This section will be automatically generated when your demo submission is processed. -->

## 📖 Project Overview

<!-- Provide a more detailed description of your project here -->

## Description

GasDaddy is a novel solution built on EIP-7702 that addresses the common challenge of executing transactions on a new blockchain without having native gas tokens. Here's how it works:

1. When you want to interact with a smart contract on a new chain but lack gas tokens, GasDaddy allows you to generate an authorization request or transaction.
2. You can share this request with your friends or community members through a simple link or message.
3. These "Gas Daddies" can then execute the transaction on your behalf, effectively sponsoring the gas fees for your operation.
4. As a fun twist, by helping you with gas, they earn the honorary title of "Gas Daddy" - a playful way to acknowledge their support.

This solution makes it easier for users to get started on new chains and encourages community support through a lighthearted, gamified approach to gas sponsorship.

## ✨ Features

- Generate and share transaction requests for gas sponsorship
- Simple link-based sharing mechanism for transaction requests
- Support for multiple blockchain networks
- Playful "Gas Daddy" acknowledgment system
- Secure transaction authorization mechanism
- Easy-to-use interface for both requesters and sponsors

Note: The frontend and backend not working, and just for demo. Because viem doesn't support sign Authorization through JSON-RPC account yet.

## 🚀 Installation

```bash
# Clone the repository
git clone

# Install dependencies
npm install  # for frontend, backend as well
```

## 🚀 Quick Start App

```bash
# macOS/Linux
./start.sh

# Windows
start.bat

# Or use npm
npm run dev
```

### Method 2: Start Separately

```bash
# 1. Install all dependencies
npm run install:all

# 2. Start backend (http://localhost:3001)
npm run backend:dev

# 3. Start frontend (http://localhost:5173)
npm run frontend:dev
```

## 📋 Environment Configuration

Configure in `backend/.env` file:

```env
SPONSOR_PRIVATE_KEY=0x... # Sponsor's private key
PORT=3001                 # Backend port (optional)
```

## 🏗️ Project Structure

```
GasDaddy/
├── frontend/          # React + shadcn/ui frontend
├── backend/          # Node.js + Express backend
├── contracts/        # Solidity smart contracts
├── src/             # Original example code
├── start.sh         # Linux/macOS startup script
├── start.bat        # Windows startup script
└── package.json     # Root project configuration
```

## 🎯 Features

### User Mode

- 🔐 Create EIP-7702 authorization (free)
- 🎁 Join GasDaddy plan, get free tokens
- 💸 Zero gas fee blockchain interactions

### Sponsor Mode

- 💰 Pay users' gas fees
- 🤝 Support multiple contracts and functions

## 🛠️ Tech Stack

### Frontend

- ⚛️ React 19 + TypeScript
- 🎨 shadcn/ui + Tailwind CSS
- 🔗 wagmi + viem (Ethereum interaction)
- ⚡ Vite (build tool)

### Backend

- 🟢 Node.js + Express
- 📡 viem (Ethereum client)
- 🔧 EIP-7702 Authorization handling

### Smart Contracts

- 🔗 Solidity + Foundry
- 🌐 General forwarding contract (GasDaddy)
- 🏆 Example SBT contract

## 📚 How It Works

### Setup delegate contract

1. **User creates authorization**: Frontend generates EIP-7702 authorization with the correct EOA nonce (not a random number)
2. **Send to relayer to setup delegate contract**: Authorization info sent to `/api/join-gasdaddy`
3. **Relayer executes**: Service provider private key to execute transaction to help user setup delegate contract

- User: https://sepolia.etherscan.io/address/0x6c28fcee0a248ed3e4c3b54ad47554f702b7df22
- Setup delegate contract tx: https://sepolia.etherscan.io/tx/0x469a4fdd9af00d7c3c1327b787fd7399846c98422735e90de3566ba607d5e735

### Build params and find Gas Daddy

1. **User selects contract to interact**: User creates params for calling contracts
2. **Looking for Gas Daddy**: Send it to friends or group

- Url example: https://gasdaddy.com/?payforme=0x6C28fCEe0a248Ed3E4C3B54AD47554f702B7DF22&targetcontract=0x639C5620dB9ec2928f426AA8f59fF50eeF67E378&method=mint&data=0x1249c58b

### Gas Daddy shows up and pay for the gas

1. **Gas Daddy pay for the gas**: User gets tokens, sponsor pays gas

- Pay for gas tx: https://sepolia.etherscan.io/tx/0x22398f9d96e943d2b984917838a30624a854e0f98b0f3689d655523c26ffac7e

**Important**: The authorization nonce must be the actual transaction count from the user's EOA, obtained via `getTransactionCount()`. Using random numbers or timestamps will cause the EIP-7702 transaction to fail.

## 🌐 Access URLs

- 🎨 **Frontend Interface**: http://localhost:5173
- 📡 **Backend API**: http://localhost:3001
- 🔍 **Health Check**: http://localhost:3001/health
- 📊 **Sponsor Info**: http://localhost:3001/api/sponsor-info

<!-- Add screenshots of your project here -->

![Screenshot 1](path/to/screenshot1.png)

## 🔮 Future Plans

- Try to make it work on frontend

## Notes

- Simple SBT for testing: https://sepolia.etherscan.io/address/0x639C5620dB9ec2928f426AA8f59fF50eeF67E378

<!-- Specify your project license -->
