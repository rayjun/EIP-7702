import {
  sponsorWalletClient,
  userWalletClient,
  eoa_sponsor,
  eoa_user,
} from './config.js';
import {
  gasDaddyAbi,
  sbtAbi,
  sbtContractAddress,
  gasDaddyContractAddress,
} from './contract.js';
import { sepolia } from 'viem/chains';
import { waitForTransactionReceipt } from 'viem/actions';
import { encodeFunctionData } from 'viem';

async function main() {
  console.log('🏦 Sponsor EOA: ', eoa_sponsor.address);
  console.log('👤 User EOA: ', eoa_user.address);
  console.log('📄 SBT Contract: ', sbtContractAddress);
  console.log('🎯 GasDaddy Contract: ', gasDaddyContractAddress);

  // EIP-7702 Gas Sponsorship Flow
  console.log('\n🚀 Starting EIP-7702 Gas Sponsorship Flow...');

  // Step 1: User EOA creates EIP-7702 authorization (offline operation, no gas required)
  console.log('\n📝 Step 1: User EOA signs EIP-7702 authorization...');
  const authorization = await userWalletClient.signAuthorization({
    account: eoa_user,
    contractAddress: gasDaddyContractAddress, // Authorization to use GasDaddy contract code
  });

  console.log('✅ Authorization signed:', {
    chainId: authorization.chainId,
    address: authorization.address,
    nonce: authorization.nonce,
  });

  // Step 2: Sponsor EOA executes transaction to User EOA address
  console.log('\n💰 Step 2: Sponsor executes transaction on behalf of user...');

  // Encode the SBT mint function call
  const sbtMintData = encodeFunctionData({
    abi: sbtAbi,
    functionName: 'mint',
    args: [],
  });

  // 🎯 Key: Send transaction to User's EOA address, not GasDaddy contract address
  const hash = await sponsorWalletClient.writeContract({
    abi: gasDaddyAbi,
    address: eoa_user.address, // Send to User's EOA address
    account: eoa_sponsor, // Sponsor pays gas
    chain: sepolia,
    authorizationList: [authorization], // Include User's authorization
    functionName: 'executeCall',
    args: [sbtContractAddress, sbtMintData], // Target contract and encoded call data
  });

  console.log('\n🎉 Transaction sent!');
  console.log(`💸 Gas paid by: ${eoa_sponsor.address}`);
  console.log(`🎭 Function executed at: ${eoa_user.address} (User's EOA)`);
  console.log(`📋 Using contract code from: ${gasDaddyContractAddress}`);
  console.log(`🏆 SBT will be minted to: ${eoa_user.address}`);
  console.log(`🔗 Transaction: https://sepolia.etherscan.io/tx/${hash}`);

  // Step 3: Wait for transaction confirmation
  console.log('\n⏳ Waiting for confirmation...');
  const receipt = await waitForTransactionReceipt(sponsorWalletClient, {
    hash,
  });

  console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
  console.log(`⛽ Gas used: ${receipt.gasUsed}`);

  // Check for events
  const callEvent = receipt.logs.find(
    (log) => log.topics[0] === '0x...' // CallSponsored event signature
  );

  if (callEvent) {
    console.log('🎊 Function call successfully executed via gas sponsorship!');
  }

  console.log('\n📊 Summary:');
  console.log(`- User (${eoa_user.address}) received SBT without paying gas`);
  console.log(`- Sponsor (${eoa_sponsor.address}) paid for the gas`);
  console.log(`- Thanks to EIP-7702, transaction executed in user's context`);
  console.log(`- The sponsor is now officially a "Gas Daddy" 👨‍👧‍👦`);
}

main().catch(console.error);
