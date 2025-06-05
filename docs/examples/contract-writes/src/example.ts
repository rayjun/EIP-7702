import { walletClient, relay } from './config.js';
import { abi, contractAddress } from './contract.js';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

async function main() {
  const eoa = privateKeyToAccount(process.env.EOA_PRIVATE_KEY as `0x${string}`);

  const authorization = await walletClient.signAuthorization({
    account: eoa,
    contractAddress,
  });

  console.log('authorization', authorization);

  const initHash = await walletClient.writeContract({
    abi,
    address: eoa.address,
    account: relay,
    chain: sepolia,
    authorizationList: [authorization],
    functionName: 'initialize',
  });

  console.log(
    `Transaction hash for initialize: https://sepolia.etherscan.io/tx/${initHash}`
  );

  // no need to sign authorization again
  const hash = await walletClient.writeContract({
    abi,
    address: eoa.address,
    chain: sepolia,
    functionName: 'ping',
  });

  console.log(
    `Transaction hash for ping: https://sepolia.etherscan.io/tx/${hash}`
  );
}

main().catch(console.error);
