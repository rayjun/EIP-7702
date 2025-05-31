import {
  sponsorWalletClient,
  userWalletClient,
  eoa_sponsor,
  eoa_user,
} from './config.js';
import { abi, contractAddress } from './contract.js';
import { sepolia } from 'viem/chains';
import { waitForTransactionReceipt, readContract } from 'viem/actions';

async function main() {
  console.log('🏦 Sponsor EOA: ', eoa_sponsor.address);
  console.log('👤 User EOA: ', eoa_user.address);
  console.log('📄 Contract Template: ', contractAddress);

  // Step 1: User EOA signs authorization to delegate to contract
  console.log('\n📝 Step 1: User EOA signs authorization...');
  const authorization = await userWalletClient.signAuthorization({
    account: eoa_user,
    contractAddress, // Authorization to use this contract's code
  });

  console.log('✅ Authorization signed:', authorization);

  // Step 2: Sponsor EOA sends transaction TO user EOA address
  console.log('\n💰 Step 2: Sponsor sends transaction to User EOA...');
  const hash = await sponsorWalletClient.writeContract({
    abi,
    address: eoa_user.address, // 🎯 KEY: Send to user EOA address, not contract address
    account: eoa_sponsor, // Sponsor pays gas
    chain: sepolia,
    authorizationList: [authorization], // Include user's authorization
    functionName: 'initialize',
  });

  console.log('\n🎉 Transaction sent!');
  console.log(`💸 Gas paid by: ${eoa_sponsor.address}`);
  console.log(`🎭 Contract executed at: ${eoa_user.address}`);
  console.log(`📄 Using contract code from: ${contractAddress}`);
  console.log(`🔗 Transaction: https://sepolia.etherscan.io/tx/${hash}`);

  // Step 3: Wait for confirmation
  console.log('\n⏳ Waiting for confirmation...');
  const receipt = await waitForTransactionReceipt(sponsorWalletClient, {
    hash,
  });
  console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
  console.log(`⛽ Gas used: ${receipt.gasUsed}`);

  // Step 4: Query execution history from user EOA
  console.log('\n🔍 Querying execution history from User EOA...');
  try {
    const latestExecution = await readContract(sponsorWalletClient, {
      abi,
      address: eoa_user.address, // Query from user EOA, not contract address
      functionName: 'getLatestExecution',
    });

    console.log('📊 Latest Execution Context:');
    console.log(
      `  - msgSender: ${latestExecution.msgSender} (should be sponsor)`
    );
    console.log(
      `  - contractAddress: ${latestExecution.contractAddress} (should be user EOA)`
    );
    console.log(`  - txOrigin: ${latestExecution.txOrigin}`);
    console.log(`  - functionName: ${latestExecution.functionName}`);
    console.log(`  - blockNumber: ${latestExecution.blockNumber}`);
  } catch (error) {
    console.log(
      'Note: Execution history query failed - this is expected after one-time authorization'
    );
  }
}

main().catch(console.error);
