import { encodeFunctionData } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { sepolia } from 'viem/chains';
import {
  sponsorWalletClient,
  eoa_sponsor,
  gasDaddyContractAddress,
} from './config.js';

/**
 * User joins GasDaddy plan - Set EOA to use GasDaddy contract code
 * @param {Object} authorization - User-signed EIP-7702 authorization
 * @returns {Object} Transaction result
 */
export async function joinGasDaddyPlan(authorization) {
  try {
    console.log('🚀 Setting up EIP-7702 delegation...');
    console.log('👤 User EOA:', authorization.address);
    console.log('🏦 Sponsor EOA:', eoa_sponsor.address);
    console.log('📝 GasDaddy Contract:', gasDaddyContractAddress);
    console.log('🔢 Nonce:', authorization.nonce);

    // Validate authorization format
    if (
      !authorization.address ||
      !authorization.chainId ||
      authorization.nonce === undefined
    ) {
      throw new Error(
        'Invalid authorization format. Required: address, chainId, nonce'
      );
    }

    // Submit type-4 EIP-7702 transaction to set user EOA to use GasDaddy contract code
    // This only sets up code delegation, doesn't execute any specific function
    const hash = await sponsorWalletClient.sendTransaction({
      account: eoa_sponsor, // sponsor pays gas
      to: authorization.address, // send to user's EOA address
      value: 0n, // don't send ETH
      data: '0x', // empty data, only set authorization
      chain: sepolia,
      authorizationList: [authorization], // contains user's authorization
    });

    console.log('🎉 EIP-7702 transaction sent!');
    console.log('💸 Gas paid by:', eoa_sponsor.address);
    console.log('🎭 User EOA now delegates to:', gasDaddyContractAddress);
    console.log('🔗 Transaction hash:', hash);

    // Wait for transaction confirmation
    console.log('⏳ Waiting for confirmation...');
    const receipt = await waitForTransactionReceipt(sponsorWalletClient, {
      hash,
    });

    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
    console.log('⛽ Gas used:', receipt.gasUsed.toString());
    console.log('🎊 User EOA successfully set up for gas sponsorship!');

    return {
      success: true,
      transactionHash: hash,
      blockNumber: receipt.blockNumber.toString(),
      gasUsed: receipt.gasUsed.toString(),
      userAddress: authorization.address,
      sponsorAddress: eoa_sponsor.address,
      gasDaddyContract: gasDaddyContractAddress,
      message: 'EOA successfully configured for GasDaddy sponsorship',
    };
  } catch (error) {
    console.error('❌ Error in joinGasDaddyPlan:', error);
    throw new Error(`Failed to set up EIP-7702 delegation: ${error.message}`);
  }
}

/**
 * Get sponsor information
 */
export function getSponsorInfo() {
  return {
    sponsorAddress: eoa_sponsor.address,
    gasDaddyContract: gasDaddyContractAddress,
    supportedChains: ['Sepolia'],
    description: 'GasDaddy - EIP-7702 Gas Sponsorship Service',
  };
}
