// IPFS utilities for uploading prompt metadata

export interface PromptMetadata {
  title: string
  description: string
  category: string
  tags: string[]
  content: string
  licenseType: string
  createdAt: string
  version: string
}

/**
 * Upload prompt metadata to IPFS via Pinata
 */
export async function uploadToIPFS(metadata: PromptMetadata): Promise<string> {
  try {
    // For now, we'll use a mock IPFS upload since we don't have Pinata configured
    // In production, this would upload to Pinata or another IPFS service
    
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Mock IPFS upload:', metadata)
    console.log('Mock IPFS hash:', mockHash)
    
    return `https://gateway.pinata.cloud/ipfs/${mockHash}`
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error('Failed to upload metadata to IPFS')
  }
}

/**
 * Create metadata object for prompt
 */
export function createPromptMetadata(formData: {
  title: string
  description: string
  content: string
  category: string
  tags: string
  licenseType: string
}): PromptMetadata {
  return {
    title: formData.title,
    description: formData.description,
    category: formData.category,
    tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    content: formData.content,
    licenseType: formData.licenseType,
    createdAt: new Date().toISOString(),
    version: '1.0.0'
  }
}
