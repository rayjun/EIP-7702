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

export const sbtAbi = [
  {
    type: 'function',
    name: 'mint',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

// Contract addresses (update these after deployment)
export const gasDaddyContractAddress =
  '0x2666c4F3B213957d529A1628316Ac9926Da4875C' as const;
export const sbtContractAddress =
  '0x639C5620dB9ec2928f426AA8f59fF50eeF67E378' as const;
