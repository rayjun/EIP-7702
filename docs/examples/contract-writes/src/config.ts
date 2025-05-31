import 'dotenv/config';
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

export const relay = privateKeyToAccount(
  process.env.RELAY_PRIVATE_KEY as `0x${string}`
);

export const walletClient = createWalletClient({
  account: relay,
  chain: sepolia,
  transport: http(),
});
