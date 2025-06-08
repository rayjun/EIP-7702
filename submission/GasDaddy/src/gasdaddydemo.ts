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
import { verifyAuthorization } from 'viem/utils';

async function main() {
  console.log('🏦 Sponsor EOA: ', eoa_sponsor.address);
  console.log('👤 User EOA: ', eoa_user.address);
  console.log('📄 SBT Contract: ', sbtContractAddress);
  console.log('🎯 GasDaddy Contract: ', gasDaddyContractAddress);

  // EIP-7702 Gas Sponsorship Flow
  console.log('\n🚀 Starting EIP-7702 Gas Sponsorship Flow...');

  // Step 1: User EOA creates EIP-7702 authorization (offline operation, no gas required)
  console.log(
    '\n📝 Step 1: User EOA signs EIP-7702 authorization and join the gas daddy plan...'
  );
  const authorization = await userWalletClient.signAuthorization({
    account: eoa_user,
    contractAddress: gasDaddyContractAddress, // Authorization to use GasDaddy contract code
  });

  console.log('✅ Authorization signed:', {
    chainId: authorization.chainId,
    address: authorization.address,
    nonce: authorization.nonce,
  });

  const valid = await verifyAuthorization({
    address: eoa_user.address,
    authorization,
  });

  console.log('✅ Authorization verified:', valid);

  // Step 1.1: send authorization to sponsor to join gas daddy plan
  console.log(
    '\n📝 Step 1.1: send authorization info to sponsor to submit, and join gas daddy plan...'
  );
  const joinGasDaddyHash = await sponsorWalletClient.sendTransaction({
    to: eoa_user.address, // send to user's EOA address
    authorizationList: [authorization], // 包含用户的授权
    data: encodeFunctionData({
      abi: gasDaddyAbi,
      functionName: 'initialize',
    }),
  });

  console.log('🎉 Transaction sent!');
  console.log(`💸 Gas paid by: ${eoa_sponsor.address}`);
  console.log(`🎭 User EOA now delegates to: ${gasDaddyContractAddress}`);
  console.log(
    `🔗 Transaction hash: https://sepolia.etherscan.io/tx/${joinGasDaddyHash}`
  );

  // Step 2: User want to mint SBT, find the SBT contract address and method
  // There will be a page to get the contract and method
  // const sbtContractAddress = '0x639C5620dB9ec2928f426AA8f59fF50eeF67E378';
  const sbtMintData = encodeFunctionData({
    abi: sbtAbi,
    functionName: 'mint',
    args: [],
  });

  // Step 2.1: Send the data to sponsor group to see who is the gas daddy and willing to pay the gas
  // There will be a page for sponsor to see the data and pay for the gas

  console.log('\n📝 Step 2.1: Found a Gas Daddy!');

  // Step 3: Sponsor EOA executes transaction to User EOA address
  console.log('\n💰 Step 3: Gas Daddy pay for the gas...');

  // 🎯 Key: Send transaction to User's EOA address, not GasDaddy contract address
  const hash = await sponsorWalletClient.writeContract({
    abi: gasDaddyAbi,
    address: eoa_user.address, // send to user's EOA address
    functionName: 'executeCall',
    args: [sbtContractAddress, sbtMintData], // Target contract and encoded call data
  });

  console.log('\n🎉 Transaction sent!');
  console.log(`💸 Gas paid by: ${eoa_sponsor.address}`);
  console.log(`🎭 Function executed at: ${eoa_user.address} (User's EOA)`);
  console.log(`📋 Using contract code from: ${gasDaddyContractAddress}`);
  console.log(`🏆 SBT will be minted to: ${eoa_user.address}`);
  console.log(`🔗 Transaction: https://sepolia.etherscan.io/tx/${hash}`);
}

main().catch(console.error);
