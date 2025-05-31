import { walletClient } from './config.js';
import { abi, contractAddress } from './contract.js';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

async function main() {
  const eoa = privateKeyToAccount(process.env.EOA_PRIVATE_KEY as `0x${string}`);

  const authorization = await walletClient.signAuthorization({
    account: eoa,
    contractAddress,
  });

  // const hash = await walletClient.writeContract({
  //   abi,
  //   address: contractAddress,
  //   account: eoa,
  //   chain: sepolia,
  //   authorizationList: [authorization],
  //   functionName: 'initialize',
  // });

  const hash = await walletClient.writeContract({
    abi,
    address: contractAddress,
    account: eoa,
    chain: sepolia,
    authorizationList: [authorization],
    functionName: 'ping',
  });

  console.log('Transaction hash:', hash);
}

main().catch(console.error);
