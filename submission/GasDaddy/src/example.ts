import {
  sponsorWalletClient,
  userWalletClient,
  eoa_sponsor,
  eoa_user,
} from './config.js';
import { abi, sbtContractAddress, sbtAbi } from './contract.js';
import { sepolia } from 'viem/chains';
import { waitForTransactionReceipt, readContract } from 'viem/actions';

async function main() {
  console.log('🏦 Sponsor EOA: ', eoa_sponsor.address);
  console.log('👤 User EOA: ', eoa_user.address);
  console.log('📄 SBT Contract: ', sbtContractAddress);

  // First: User EOA mint SBT in a normal way for comparison
  const mintSBT = await userWalletClient.writeContract({
    abi: sbtAbi,
    address: '0x639C5620dB9ec2928f426AA8f59fF50eeF67E378',
    account: eoa_user,
    chain: sepolia,
    functionName: 'mint',
  });

  console.log('🎉 SBT minted!');
  console.log(`🔗 Transaction: https://sepolia.etherscan.io/tx/${mintSBT}`);
}

main().catch(console.error);
