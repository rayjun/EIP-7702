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

## TODO

- [ ] Implementation design
- [ ] Init code with proper tech stacks
- [ ] Finish generating authorization logic
- [ ] Finish sponsorship logic
- [ ] Polish FrontEnd UI

## 🛠️ Technologies Used

- Technology 1
- Technology 2
- Technology 3

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo.git

# Navigate to the project directory
cd your-repo

# Install dependencies
npm install  # or yarn install, pnpm install, etc.
```

## 🚀 Quick Start

### Method 1: One-click Start (Recommended)

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

- 📊 View sponsorship activity dashboard
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

1. **User creates authorization**: Frontend generates EIP-7702 authorization
2. **Send to backend**: Authorization info sent to `/api/join-gasdaddy`
3. **Sponsor executes**: Backend uses sponsor private key to execute transaction
4. **Contract delegation**: User EOA temporarily uses GasDaddy contract code
5. **Call forwarding**: Execute target contract's specified function
6. **Return result**: User gets tokens, sponsor pays gas

## 🔧 Available Scripts

```bash
# Development mode (start both frontend and backend)
npm run dev

# Production mode
npm run start

# Install all dependencies
npm run install:all

# Backend related
npm run backend:dev      # Development mode
npm run backend:start    # Production mode
npm run backend:install  # Install backend dependencies

# Frontend related
npm run frontend:dev      # Development mode
npm run frontend:build    # Build production version
npm run frontend:preview  # Preview build result
npm run frontend:install  # Install frontend dependencies
```

## 🌐 Access URLs

- 🎨 **Frontend Interface**: http://localhost:5173
- 📡 **Backend API**: http://localhost:3001
- 🔍 **Health Check**: http://localhost:3001/health
- 📊 **Sponsor Info**: http://localhost:3001/api/sponsor-info

## ⚠️ Notes

- Ensure correct Sponsor private key is configured
- Frontend and backend need to run on different ports
- Recommend testing on Sepolia testnet
- Do not use test private keys in production environment

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

## 📄 License

ISC License

## 📷 Screenshots

<!-- Add screenshots of your project here -->

![Screenshot 1](path/to/screenshot1.png)

## 🔮 Future Plans

- Future feature 1
- Future feature 2

## Notes

- Simple SBT for testing: https://sepolia.etherscan.io/address/0x639C5620dB9ec2928f426AA8f59fF50eeF67E378

<!-- Specify your project license -->
