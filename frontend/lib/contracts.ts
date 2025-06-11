// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  AIPromptRegistry: '0xddff06183Ae7DC9142c86b5846cf03fDCd68D8E4',
  PromptMarketplace: '0xeefb77A1081b7C5d3AB96e56c463386a6559D912',
  PromptLicensing: '0x00604a04db48254f0895dC2081DDf3Bdd947a4df',
} as const

// AIPromptRegistry ABI - only the functions we need
export const AI_PROMPT_REGISTRY_ABI = [
  {
    "type": "function",
    "name": "mintPrompt",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "title", "type": "string" },
      { "name": "description", "type": "string" },
      { "name": "category", "type": "string" },
      { "name": "tags", "type": "string[]" },
      { "name": "_tokenURI", "type": "string" }
    ],
    "outputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "ipId", "type": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "promptMetadata",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [
      { "name": "title", "type": "string" },
      { "name": "description", "type": "string" },
      { "name": "category", "type": "string" },
      { "name": "tags", "type": "string[]" },
      { "name": "createdAt", "type": "uint256" },
      { "name": "creator", "type": "address" },
      { "name": "isActive", "type": "bool" },
      { "name": "usageCount", "type": "uint256" },
      { "name": "rating", "type": "uint256" },
      { "name": "ratingCount", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "categoryExists",
    "inputs": [{ "name": "category", "type": "string" }],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCreatorPrompts",
    "inputs": [{ "name": "creator", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      { "name": "operator", "type": "address" },
      { "name": "approved", "type": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "operator", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getApproved",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "PromptMinted",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "creator", "type": "address", "indexed": true },
      { "name": "ipId", "type": "address", "indexed": true },
      { "name": "title", "type": "string", "indexed": false },
      { "name": "category", "type": "string", "indexed": false }
    ]
  }
] as const

// PromptMarketplace ABI - main functions
export const PROMPT_MARKETPLACE_ABI = [
  {
    "type": "function",
    "name": "createListing",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "price", "type": "uint256" },
      { "name": "paymentToken", "type": "address" },
      { "name": "duration", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "buyPrompt",
    "inputs": [
      { "name": "listingId", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "cancelListing",
    "inputs": [
      { "name": "listingId", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getActiveListings",
    "inputs": [
      { "name": "tokenId", "type": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserActiveListings",
    "inputs": [
      { "name": "user", "type": "address" }
    ],
    "outputs": [
      { "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "listings",
    "inputs": [
      { "name": "listingId", "type": "uint256" }
    ],
    "outputs": [
      { "name": "listingId", "type": "uint256" },
      { "name": "tokenId", "type": "uint256" },
      { "name": "seller", "type": "address" },
      { "name": "price", "type": "uint256" },
      { "name": "paymentToken", "type": "address" },
      { "name": "isActive", "type": "bool" },
      { "name": "createdAt", "type": "uint256" },
      { "name": "expiresAt", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ListingCreated",
    "inputs": [
      { "name": "listingId", "type": "uint256", "indexed": true },
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "seller", "type": "address", "indexed": true },
      { "name": "price", "type": "uint256", "indexed": false },
      { "name": "paymentToken", "type": "address", "indexed": false }
    ]
  }
] as const

// Predefined categories that exist in the contract
export const PROMPT_CATEGORIES = [
  'Text Generation',
  'Image Generation', 
  'Code Generation',
  'Creative Writing',
  'Business',
  'Education',
  'Entertainment',
  'Other'
] as const

export type PromptCategory = typeof PROMPT_CATEGORIES[number]
