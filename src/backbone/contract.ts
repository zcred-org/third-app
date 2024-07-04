export const contractAbi = [
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_requireWei',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'ChangeOwner',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'newRequireWei',
        'type': 'uint256',
      },
    ],
    'name': 'ChangeRequireWei',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'subjectId',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'bytes20',
        'name': 'sybilId',
        'type': 'bytes20',
      },
    ],
    'name': 'SybilAdd',
    'type': 'event',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_address',
        'type': 'address',
      },
    ],
    'name': 'getSybilId',
    'outputs': [
      {
        'internalType': 'bytes20',
        'name': '',
        'type': 'bytes20',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'internalType': 'address payable',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'requireWei',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_newOwner',
        'type': 'address',
      },
    ],
    'name': 'setOwner',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_requireWei',
        'type': 'uint256',
      },
    ],
    'name': 'setRequireWei',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'bytes20',
        'name': '_sybilId',
        'type': 'bytes20',
      },
      {
        'internalType': 'bytes',
        'name': 'signature',
        'type': 'bytes',
      },
    ],
    'name': 'setSybilId',
    'outputs': [],
    'stateMutability': 'payable',
    'type': 'function',
  },
];
