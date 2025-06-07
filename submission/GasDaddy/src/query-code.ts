import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { isAddress } from 'viem';
import { contractAddress } from './contract.js';

// Create public client for reading blockchain state
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://eth-sepolia.public.blastapi.io'),
});

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🔍 EIP-7702 EOA Code Query Tool

Usage:
  npx tsx src/query-code.ts <EOA_ADDRESS> [OPTIONS]

Arguments:
  EOA_ADDRESS     The EOA address to query (required)

Options:
  --compare       Compare with contract template
  --monitor       Monitor code changes every 5 seconds
  --help, -h      Show this help message

Examples:
  npx tsx src/query-code.ts 0x742d35Cc6634C0532925a3b8D76C93C4d2bA9E07
  npx tsx src/query-code.ts 0x742d35Cc6634C0532925a3b8D76C93C4d2bA9E07 --compare
  npx tsx src/query-code.ts 0x742d35Cc6634C0532925a3b8D76C93C4d2bA9E07 --monitor
    `);
    process.exit(0);
  }

  const address = args[0];
  const options = {
    compare: args.includes('--compare'),
    monitor: args.includes('--monitor'),
  };

  // Validate address
  if (!isAddress(address)) {
    console.error('❌ Error: Invalid Ethereum address');
    console.error(`   Provided: ${address}`);
    console.error('   Expected format: 0x...');
    process.exit(1);
  }

  return { address: address as `0x${string}`, options };
}

async function queryEOACode(
  targetAddress: `0x${string}`,
  options: { compare: boolean; monitor: boolean }
) {
  console.log('🔍 Querying EOA Code Information...\n');

  // 1. Query target EOA bytecode
  console.log(`🎯 Target EOA: ${targetAddress}`);
  try {
    const targetCode = await publicClient.getBytecode({
      address: targetAddress,
    });

    if (targetCode && targetCode !== '0x') {
      console.log('✅ EOA has contract code!');
      console.log(`📝 Code length: ${targetCode.length} characters`);
      console.log(`🔗 Code (first 100 chars): ${targetCode.slice(0, 100)}...`);
      console.log(`🔗 Code (last 50 chars): ...${targetCode.slice(-50)}`);
    } else {
      console.log('❌ EOA has no contract code (standard EOA)');
    }
  } catch (error) {
    console.log('❌ Error querying EOA code:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // 2. Query account nonce and balance
  console.log('📊 Account State:');
  try {
    const [nonce, balance] = await Promise.all([
      publicClient.getTransactionCount({ address: targetAddress }),
      publicClient.getBalance({ address: targetAddress }),
    ]);

    console.log(`📋 Nonce: ${nonce}`);
    console.log(`💰 Balance: ${balance} wei (${Number(balance) / 1e18} ETH)`);
  } catch (error) {
    console.log('❌ Error querying account state:', error);
  }

  // 3. Compare with contract template (if requested)
  if (options.compare) {
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('🔄 Contract Template Comparison:');

    try {
      console.log(`📄 Contract Template: ${contractAddress}`);

      const [targetCode, templateCode] = await Promise.all([
        publicClient.getBytecode({ address: targetAddress }),
        publicClient.getBytecode({ address: contractAddress }),
      ]);

      if (templateCode && templateCode !== '0x') {
        console.log('✅ Contract template has code');
        console.log(
          `📝 Template code length: ${templateCode.length} characters`
        );

        if (targetCode && templateCode && targetCode === templateCode) {
          console.log('🎯 ✅ EOA code matches template contract code!');
          console.log('🚀 EIP-7702 delegation is ACTIVE');
        } else if (targetCode && templateCode) {
          console.log('⚠️  EOA code differs from template contract code');
          console.log(`   EOA code length: ${targetCode.length}`);
          console.log(`   Template code length: ${templateCode.length}`);
          console.log('🤔 Different contract or modified delegation');
        } else if (!targetCode || targetCode === '0x') {
          console.log('❌ EOA has no code while template has code');
          console.log('💡 Run EIP-7702 transaction to activate delegation');
        } else {
          console.log('❌ Template contract has no code');
        }
      } else {
        console.log('❌ Contract template has no code');
        console.log('💡 Deploy the contract first');
      }
    } catch (error) {
      console.log('❌ Error comparing codes:', error);
    }
  }
}

async function monitorEOACode(targetAddress: `0x${string}`) {
  console.log(`🔄 Monitoring EOA code changes for: ${targetAddress}`);
  console.log('Press Ctrl+C to stop monitoring\n');

  let lastCodeHash = '';

  const checkCode = async () => {
    try {
      const code = await publicClient.getBytecode({ address: targetAddress });
      const hasCode = code && code !== '0x';
      const codeHash = hasCode
        ? `${code.slice(0, 10)}...${code.slice(-10)}`
        : 'NO_CODE';

      // Only log if code changed
      if (codeHash !== lastCodeHash) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${targetAddress}:`);

        if (hasCode) {
          console.log(`  ✅ HAS CODE (${code.length} chars)`);
          console.log(`  🔗 Hash: ${codeHash}`);
        } else {
          console.log(`  ❌ NO CODE`);
        }

        lastCodeHash = codeHash;
      }
    } catch (error) {
      console.log(`❌ Error monitoring: ${error}`);
    }
  };

  // Initial check
  await checkCode();

  // Monitor every 5 seconds
  setInterval(checkCode, 5000);
}

// Main execution
async function main() {
  const { address, options } = parseArgs();

  if (options.monitor) {
    await monitorEOACode(address);
  } else {
    await queryEOACode(address, options);
  }
}

main().catch(console.error);
