import { walletClient } from './config.js';
import { abi, contractAddress } from './contract.js';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { relay } from './config.js';

async function main() {
  const eoa = privateKeyToAccount(process.env.EOA_PRIVATE_KEY as `0x${string}`);

  const authorization = await walletClient.signAuthorization({
    account: eoa,
    contractAddress,
  });

  console.log('authorization', authorization);

  // self execute delegation contract
  // const hash = await walletClient.writeContract({
  //   abi,
  //   address: eoa.address,
  //   account: eoa,
  //   chain: sepolia,
  //   authorizationList: [authorization],
  //   functionName: 'initialize',
  // });

  // execute delegation contract by relay
  const hash = await walletClient.writeContract({
    abi,
    address: eoa.address,
    account: relay,
    chain: sepolia,
    authorizationList: [authorization],
    functionName: 'initialize',
  });

  // const hash = await walletClient.writeContract({
  //   abi,
  //   address: eoa.address,
  //   account: eoa,
  //   chain: sepolia,
  //   authorizationList: [authorization],
  //   functionName: 'ping',
  // });

  console.log(`Transaction hash: https://sepolia.etherscan.io/tx/${hash}`);
}

main().catch(console.error);
