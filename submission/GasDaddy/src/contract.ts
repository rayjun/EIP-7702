export const abi = [
  {
    type: 'function',
    name: 'mint',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'ping',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'showEIP7702Context',
    inputs: [],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'msgSender', type: 'address' },
          { name: 'contractAddress', type: 'address' },
          { name: 'txOrigin', type: 'address' },
          { name: 'blockNumber', type: 'uint256' },
          { name: 'gasLeft', type: 'uint256' },
          { name: 'value', type: 'uint256' },
          { name: 'functionName', type: 'string' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'batchOperation',
    inputs: [{ name: 'operations', type: 'string[]' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'debugAddresses',
    inputs: [],
    outputs: [
      { name: 'msgSender', type: 'address' },
      { name: 'contractThis', type: 'address' },
      { name: 'txOrigin', type: 'address' },
      { name: 'isSponsoredTransaction', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getExecutionHistory',
    inputs: [{ name: 'executionId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'msgSender', type: 'address' },
          { name: 'contractAddress', type: 'address' },
          { name: 'txOrigin', type: 'address' },
          { name: 'blockNumber', type: 'uint256' },
          { name: 'gasLeft', type: 'uint256' },
          { name: 'value', type: 'uint256' },
          { name: 'functionName', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getLatestExecution',
    inputs: [],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'msgSender', type: 'address' },
          { name: 'contractAddress', type: 'address' },
          { name: 'txOrigin', type: 'address' },
          { name: 'blockNumber', type: 'uint256' },
          { name: 'gasLeft', type: 'uint256' },
          { name: 'value', type: 'uint256' },
          { name: 'functionName', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'executionCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ExecutionDetails',
    inputs: [
      { name: 'executionId', type: 'uint256', indexed: true },
      { name: 'msgSender', type: 'address', indexed: true },
      { name: 'contractAddress', type: 'address', indexed: true },
      { name: 'txOrigin', type: 'address', indexed: false },
      { name: 'functionName', type: 'string', indexed: false },
      { name: 'blockNumber', type: 'uint256', indexed: false },
      { name: 'gasUsed', type: 'uint256', indexed: false },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'EIP7702Context',
    inputs: [
      { name: 'sponsor', type: 'address', indexed: false },
      { name: 'userEOA', type: 'address', indexed: false },
      { name: 'isSponsoredTx', type: 'bool', indexed: false },
    ],
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
] as const;

export const sbtAbi = [
  {
    type: 'function',
    name: 'mint',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const gasDaddyAbi = [
  {
    type: 'function',
    name: 'executeCall',
    inputs: [
      { name: 'target', type: 'address' },
      { name: 'data', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'executeMultiCall',
    inputs: [
      { name: 'targets', type: 'address[]' },
      { name: 'data', type: 'bytes[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getContext',
    inputs: [],
    outputs: [
      { name: 'msgSender', type: 'address' },
      { name: 'contractThis', type: 'address' },
      { name: 'txOrigin', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'CallSponsored',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'target', type: 'address', indexed: true },
      { name: 'sponsor', type: 'address', indexed: true },
      { name: 'selector', type: 'bytes4', indexed: false },
      { name: 'success', type: 'bool', indexed: false },
    ],
  },
] as const;

// Deploy new contract and update this address after deployment
export const gasDaddyContractAddress =
  '0x2666c4F3B213957d529A1628316Ac9926Da4875C';

// Deploy new contract and update this address after deployment
export const sbtContractAddress = '0x639C5620dB9ec2928f426AA8f59fF50eeF67E378';
