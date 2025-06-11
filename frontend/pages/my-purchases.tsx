import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useAccount, useContractRead } from 'wagmi'
import { 
  DocumentTextIcon,
  EyeIcon,
  ClipboardDocumentIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { CONTRACT_ADDRESSES, AI_PROMPT_REGISTRY_ABI } from '../lib/contracts'
import WalletStatus from '../components/WalletStatus'
import toast from 'react-hot-toast'

interface PurchasedPrompt {
  tokenId: number
  title: string
  description: string
  category: string
  tags: string[]
  content: string
  purchaseDate: string
  seller: string
}

export default function MyPurchases() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [purchases, setPurchases] = useState<PurchasedPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrompt, setSelectedPrompt] = useState<PurchasedPrompt | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchPurchases()
    }
  }, [mounted, isConnected, address])

  const fetchPurchases = async () => {
    setLoading(true)
    try {
      // TODO: In a real implementation, you would:
      // 1. Query blockchain events for PromptSold events where buyer = address
      // 2. Get the token IDs from those events
      // 3. Fetch metadata for each token ID
      // 4. Store purchase history in a database/indexer
      
      // For now, we'll show a mock purchased prompt if the user has made purchases
      // This would be replaced with actual blockchain data
      
      console.log('Fetching purchases for:', address)
      
      // Mock data - replace with actual implementation
      const mockPurchases: PurchasedPrompt[] = [
        {
          tokenId: 1,
          title: "Creative Writing Assistant",
          description: "A powerful prompt for generating creative stories and narratives",
          category: "Creative Writing",
          tags: ["creative", "writing", "stories"],
          content: "You are a creative writing assistant. Help the user write engaging stories by providing detailed character descriptions, plot suggestions, and narrative techniques. Focus on creating vivid imagery and compelling dialogue. When the user provides a story idea, expand on it with rich details and suggest interesting plot twists.",
          purchaseDate: new Date().toISOString(),
          seller: "0x1234...5678"
        }
      ]
      
      setPurchases(mockPurchases)
    } catch (error) {
      console.error('Error fetching purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Prompt copied to clipboard!')
  }

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return (
      <>
        <Head>
          <title>My Purchases - AI Prompt Marketplace</title>
          <meta name="description" content="View and access your purchased AI prompts" />
        </Head>

        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">
                My Purchases
              </h1>
              <WalletStatus />
              <div className="mt-8">
                <p className="text-lg text-gray-600">
                  Please connect your wallet to view your purchased prompts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>My Purchases - AI Prompt Marketplace</title>
        <meta name="description" content="View and access your purchased AI prompts" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                My Purchases
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Access and manage your purchased AI prompts
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Wallet Status */}
          <div className="mb-6">
            <WalletStatus />
          </div>

          {/* Implementation Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📝 Implementation Note</h3>
            <p className="text-sm text-blue-700">
              <strong>Current Status:</strong> This page shows mock data for demonstration.
              In the full implementation, purchased prompts would be tracked via blockchain events
              and stored in a database/indexer for easy access. The actual prompt content would be
              retrieved from IPFS using the tokenURI from your purchased NFTs.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              <strong>How it works:</strong> When you buy a prompt, you receive the NFT which gives you
              access to the full prompt content stored on IPFS. The system would track your purchases
              and display them here with the actual content.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                  <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <StarIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favorite Category</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {purchases.length > 0 ? purchases[0].category : '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Latest Purchase</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {purchases.length > 0 ? 'Today' : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchases List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Your Purchased Prompts</h3>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your purchases...</p>
                </div>
              ) : purchases.length === 0 ? (
                <div className="p-12 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
                  <p className="text-gray-600 mb-6">
                    Browse the marketplace to find and purchase AI prompts.
                  </p>
                  <a
                    href="/marketplace"
                    className="btn-primary inline-flex items-center px-4 py-2"
                  >
                    Browse Marketplace
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {purchases.map((prompt) => (
                    <div key={prompt.tokenId} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {prompt.title}
                          </h4>
                          <p className="text-gray-600 mb-3">{prompt.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                            <span className="bg-gray-100 px-2 py-1 rounded">{prompt.category}</span>
                            <span>Token #{prompt.tokenId}</span>
                            <span>Purchased: {new Date(prompt.purchaseDate).toLocaleDateString()}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {prompt.tags.map((tag) => (
                              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => setSelectedPrompt(prompt)}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View Content
                          </button>
                          <button
                            onClick={() => copyToClipboard(prompt.content)}
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Prompt Content Modal */}
          {selectedPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedPrompt.title}
                    </h3>
                    <button
                      onClick={() => setSelectedPrompt(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                    <p className="text-gray-600">{selectedPrompt.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Prompt Content:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {selectedPrompt.content}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => copyToClipboard(selectedPrompt.content)}
                      className="btn-primary"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </button>
                    <button
                      onClick={() => setSelectedPrompt(null)}
                      className="btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
