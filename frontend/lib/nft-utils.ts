// Utility functions for working with NFTs and purchased prompts

import { CONTRACT_ADDRESSES } from './contracts'

/**
 * Get NFTs owned by a user
 * This is a simplified implementation - in production you'd use:
 * - The Graph Protocol indexer
 * - Alchemy/Moralis NFT APIs
 * - Custom backend with event indexing
 */
export async function getUserOwnedNFTs(userAddress: string, rpcUrl: string): Promise<number[]> {
  try {
    // This would typically query:
    // 1. Transfer events where 'to' = userAddress
    // 2. Current ownership via balanceOf and tokenOfOwner
    // 3. Filter for prompts purchased (not created)
    
    console.log('Getting owned NFTs for:', userAddress)
    
    // Mock implementation - replace with actual blockchain queries
    return []
  } catch (error) {
    console.error('Error getting owned NFTs:', error)
    return []
  }
}

/**
 * Get prompt metadata from IPFS
 */
export async function getPromptMetadata(tokenURI: string) {
  try {
    const response = await fetch(tokenURI)
    const metadata = await response.json()
    return metadata
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return null
  }
}

/**
 * Check if user owns a specific token
 */
export async function checkTokenOwnership(
  tokenId: number, 
  userAddress: string, 
  rpcUrl: string
): Promise<boolean> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: CONTRACT_ADDRESSES.AIPromptRegistry,
            data: `0x6352211e${tokenId.toString(16).padStart(64, '0')}` // ownerOf(tokenId)
          },
          'latest'
        ],
        id: 1,
      }),
    })

    const data = await response.json()
    
    if (data.result) {
      // Decode the address from the result
      const owner = '0x' + data.result.slice(-40)
      return owner.toLowerCase() === userAddress.toLowerCase()
    }
    
    return false
  } catch (error) {
    console.error('Error checking token ownership:', error)
    return false
  }
}

/**
 * Get purchase history from blockchain events
 * In a real implementation, this would:
 * 1. Query PromptSold events from the marketplace contract
 * 2. Filter events where buyer = userAddress
 * 3. Extract tokenId, price, seller, timestamp
 * 4. Fetch metadata for each token
 */
export async function getPurchaseHistory(userAddress: string): Promise<any[]> {
  try {
    // This would query blockchain events like:
    // const filter = {
    //   address: CONTRACT_ADDRESSES.PromptMarketplace,
    //   topics: [
    //     '0x...', // PromptSold event signature
    //     null,    // listingId (any)
    //     null,    // tokenId (any)
    //     null,    // seller (any)
    //     userAddress // buyer (filter for this user)
    //   ]
    // }
    
    console.log('Getting purchase history for:', userAddress)
    
    // Mock data for demonstration
    return [
      {
        tokenId: 1,
        price: '100000000000000000', // 0.1 ETH in wei
        seller: '0x1234567890123456789012345678901234567890',
        blockNumber: 12345,
        transactionHash: '0xabcdef...',
        timestamp: Date.now() - 86400000 // 1 day ago
      }
    ]
  } catch (error) {
    console.error('Error getting purchase history:', error)
    return []
  }
}

/**
 * Format purchase data for display
 */
export function formatPurchaseData(purchase: any) {
  return {
    tokenId: purchase.tokenId,
    price: purchase.price,
    seller: purchase.seller,
    purchaseDate: new Date(purchase.timestamp).toISOString(),
    transactionHash: purchase.transactionHash
  }
}
