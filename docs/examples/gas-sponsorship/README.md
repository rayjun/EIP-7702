# Gas Sponsorship with EIP-7702

Delegation Contract: https://sepolia.etherscan.io/address/0x3fda0012d82feaec6e5cfedd17735937b2d9ed4c#code

EnhancedDelegation Contract: https://sepolia.etherscan.io/address/0xd880C84eEB56da17dbAC23998a347c1F98729C53#code

## Usage

```
npm install
```

Create .env based on the .env.example and put private keys in it.

```
npx tsx src/example.ts
```

Check code on EOA:

```
npx tsx src/query-code.ts 0x...
```

Deploy contract:

```bash
cd docs/examples/gas-sponsorship
forge install foundry-rs/forge-std --no-git --no-commit
cp env.example .env
vim .env

forge build
forge script contracts/script/Deploy.s.sol \
  --rpc-url sepolia \
  --broadcast \
  --verify
```

After deploy, don't forget update the contract address and abi in contract.ts file.
