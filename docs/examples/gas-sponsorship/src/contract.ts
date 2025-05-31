export const abi = [
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

// Deploy new contract and update this address after deployment
export const contractAddress = '0xd880C84eEB56da17dbAC23998a347c1F98729C53';
