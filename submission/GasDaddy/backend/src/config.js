import 'dotenv/config';
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Sponsor EOA (backend-controlled account used to pay gas)
if (!process.env.SPONSOR_PRIVATE_KEY) {
  throw new Error('SPONSOR_PRIVATE_KEY is not set');
}
export const eoa_sponsor = privateKeyToAccount(process.env.SPONSOR_PRIVATE_KEY);

export const sponsorWalletClient = createWalletClient({
  account: eoa_sponsor,
  chain: sepolia,
  transport: http(),
});

// GasDaddy contract address (used for EIP-7702 code delegation)
export const gasDaddyContractAddress =
  '0x2666c4F3B213957d529A1628316Ac9926Da4875C';
