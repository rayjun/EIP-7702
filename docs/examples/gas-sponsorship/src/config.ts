import 'dotenv/config';
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

export const eoa_sponsor = privateKeyToAccount(
  process.env.SPONSOR_PRIVATE_KEY as `0x${string}`
);

export const eoa_user = privateKeyToAccount(
  process.env.USER_PRIVATE_KEY as `0x${string}`
);

export const sponsorWalletClient = createWalletClient({
  account: eoa_sponsor,
  chain: sepolia,
  transport: http(),
});

// 用于 EOA2 签署授权的 wallet client
export const userWalletClient = createWalletClient({
  account: eoa_user,
  chain: sepolia,
  transport: http(),
});
