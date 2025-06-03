# 🚀 EIP-7702 Casual Hackathon Project Demo Submission

<!--
Please fill out the information below. This information will be automatically processed.
Do not remove the --- markers or change the field names.
-->

---
## 📋 Project Information (required)

```yaml
project_name: "OPF7702" # Your project name
description: "All-in-one EIP-7702 powered smart accounts with session key support
" # Brief description of your project
```

## 👥 Team Information (required)

```yaml
team_members: ["0xKoiner"] # List of team members' usernames, e.g. ["alice", "bob"]
```

## 🔍 Additional Information (optional)

```yaml
presentation_link: "https://www.youtube.com/watch?v=bE7YUrThS5k" # Link to your presentation slides or video
notes: "Smart account system with Delegator and SessionKeyManager contracts designed for EIP-7702 and ERC-4337 compatibility." # Any additional information about your project
```
---

<!-- Do not edit below this line. This section will be automatically generated when your demo submission is processed. -->

## 📖 Project Overview

<!-- Provide a more detailed description of your project here -->

## ✨ Features

- 🧠 EIP-7702 account logic with support for setCode transactions
- 🔐 Session key registration with expiration, selector, and target whitelisting
- 🔄 Delegator contract for deterministic account creation
- 🌐 WebAuthn (P-256) and prehashed P256 signature verification on-chain
- 🧾 EIP-1271-compliant signature validation
- ⚙️ Full ERC-4337 entry point compatibility
- 📦 Includes Foundry tests and scripts for viem-based operation submission

## 🛠️ Technologies Used

- Solidity
- EIP-7702 / EIP-4337 / ERC-1271
- Foundry
- viem (JavaScript)
- OpenZeppelin Contracts

## ✳️ Live Demo
https://7702.openfort.xyz/

## 🚀 Installation
### !!! Check .env_example file !!!

```bash
# Clone the repository
git clone https://github.com/openfort-xyz/openfort-7702-account

# Navigate to the project directory
cd openfort-7702-account

# Install dependencies

forge init

make install-ts  # or yarn install, pnpm install, etc.

make install-forge  # or yarn install, pnpm install, etc.
```

## 🏃‍♂️ Running the Project

```bash
# Start the development server
make test-all  # or yarn install, pnpm install, etc.
```

## 📷 Screenshots

<!-- Add screenshots of your project here -->
![Screenshot 1](images/Screenshot.png)

## 🔮 Future Plans

- Recoverable
- ZkVerifier
- ZkEmail
- Stealth Account

## 📝 License
MIT
<!-- Specify your project license -->
