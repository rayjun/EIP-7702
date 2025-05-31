import {
  sponsorWalletClient,
  userWalletClient,
  eoa_sponsor,
  eoa_user,
} from './config.js';
import { abi, contractAddress } from './contract.js';
import { sepolia } from 'viem/chains';
import { waitForTransactionReceipt } from 'viem/actions';

async function main() {
  console.log('eoa_sponsor: ', eoa_sponsor.address);
  console.log('eoa_user: ', eoa_user.address);

  const authorization = await userWalletClient.signAuthorization({
    account: eoa_user,
    contractAddress,
  });

  console.log('authorization: ', authorization);

  const hash = await sponsorWalletClient.writeContract({
    abi,
    address: contractAddress,
    account: eoa_sponsor,
    chain: sepolia,
    authorizationList: [authorization],
    functionName: 'initialize',
  });

  console.log('\n🎉 Transaction sent!');
  console.log(`💸 Gas paid by: ${eoa_sponsor.address}`);
  console.log(`🎭 Contract executed as: ${eoa_user.address}`);
  console.log(`🔗 Transaction: https://sepolia.etherscan.io/tx/${hash}`);

  // 步骤3: 验证交易状态
  console.log('\n⏳ Waiting for confirmation...');
  const receipt = await waitForTransactionReceipt(sponsorWalletClient, {
    hash,
  });
  console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
  console.log(`⛽ Gas used: ${receipt.gasUsed}`);
}

main().catch(console.error);
