# Deploy contract

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
