import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { CONTRACT_ADDRESSES, AI_PROMPT_REGISTRY_ABI, PROMPT_MARKETPLACE_ABI } from '../lib/contracts'
import WalletStatus from '../components/WalletStatus'

interface Prompt {
  tokenId: number
  title: string
  description: string
  category: string
  tags: string[]
  createdAt: number
  isActive: boolean
  usageCount: number
  rating: number
  ratingCount: number
}

export default function MyPrompts() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [listingModal, setListingModal] = useState<{ open: boolean; tokenId?: number }>({ open: false })
  const [listingForm, setListingForm] = useState({
    price: '',
    duration: '7' // days
  })

  // Get user's prompt token IDs
  const { data: promptIds, isLoading: idsLoading } = useContractRead({
    address: CONTRACT_ADDRESSES.AIPromptRegistry,
    abi: AI_PROMPT_REGISTRY_ABI,
    functionName: 'getCreatorPrompts',
    args: [address],
    enabled: !!address && isConnected,
    watch: true,
  })

  // Approval for marketplace
  const {
    write: approveMarketplace,
    isLoading: isApproving
  } = useContractWrite({
    address: CONTRACT_ADDRESSES.AIPromptRegistry,
    abi: AI_PROMPT_REGISTRY_ABI,
    functionName: 'setApprovalForAll',
  })

  // Create listing
  const {
    data: listingData,
    write: createListing,
    isLoading: isListing
  } = useContractWrite({
    address: CONTRACT_ADDRESSES.PromptMarketplace,
    abi: PROMPT_MARKETPLACE_ABI,
    functionName: 'createListing',
  })

  // Wait for listing transaction
  const {
    isLoading: isListingTxLoading,
    isSuccess: isListingSuccess
  } = useWaitForTransaction({
    hash: listingData?.hash,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (promptIds && promptIds.length > 0) {
      // TODO: Fetch metadata for each prompt ID
      // For now, we'll show mock data
      setLoading(false)
    } else if (promptIds && promptIds.length === 0) {
      setPrompts([])
      setLoading(false)
    }
  }, [promptIds])

  // Handle listing success
  useEffect(() => {
    if (isListingSuccess) {
      toast.success('Prompt listed on marketplace successfully!')
      setListingModal({ open: false })
      setListingForm({ price: '', duration: '7' })
    }
  }, [isListingSuccess])

  const handleListOnMarketplace = (tokenId: number) => {
    setListingModal({ open: true, tokenId })
  }

  const handleCreateListing = async () => {
    if (!listingForm.price || !listingModal.tokenId) {
      toast.error('Please enter a price')
      return
    }

    try {
      const priceInWei = parseEther(listingForm.price)
      const durationInSeconds = parseInt(listingForm.duration) * 24 * 60 * 60 // days to seconds

      // First approve marketplace if not already approved
      toast.loading('Approving marketplace...', { id: 'approve' })

      approveMarketplace({
        args: [CONTRACT_ADDRESSES.PromptMarketplace, true]
      })

      // Wait a bit for approval, then create listing
      setTimeout(() => {
        toast.loading('Creating listing...', { id: 'approve' })

        createListing({
          args: [
            BigInt(listingModal.tokenId),
            priceInWei,
            '0x0000000000000000000000000000000000000000', // ETH payment
            BigInt(durationInSeconds)
          ]
        })
      }, 2000)

    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error('Failed to create listing')
    }
  }

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return (
      <>
        <Head>
          <title>My Prompts - AI Prompt Marketplace</title>
          <meta name="description" content="Manage your AI prompts and view analytics" />
        </Head>

        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">
                My Prompts
              </h1>
              <WalletStatus />
              <div className="mt-8">
                <p className="text-lg text-gray-600">
                  Please connect your wallet to view your prompts.
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
        <title>My Prompts - AI Prompt Marketplace</title>
        <meta name="description" content="Manage your AI prompts and view analytics" />
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    My Prompts
                  </h1>
                  <p className="mt-4 text-lg text-gray-600">
                    Manage your AI prompts and track their performance
                  </p>
                </div>
                <Link
                  href="/create"
                  className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create New Prompt
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Wallet Status */}
          <div className="mb-6">
            <WalletStatus />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Prompts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {promptIds ? promptIds.length : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">0.00 IP</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prompts List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Your Prompts</h3>
              </div>

              {loading || idsLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your prompts...</p>
                </div>
              ) : promptIds && promptIds.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {promptIds.map((tokenId: bigint, index: number) => (
                    <div key={tokenId.toString()} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">
                            Prompt #{tokenId.toString()}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Token ID: {tokenId.toString()}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Created recently</span>
                            <span>•</span>
                            <span>Active</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleListOnMarketplace(Number(tokenId))}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            <ShoppingCartIcon className="h-4 w-4 mr-1" />
                            List on Marketplace
                          </button>
                          <button className="btn-secondary text-sm px-3 py-1">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button className="btn-secondary text-sm px-3 py-1">
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first AI prompt to get started on your journey as a prompt creator.
                  </p>
                  <Link
                    href="/create"
                    className="btn-primary inline-flex items-center px-4 py-2"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Your First Prompt
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Listing Modal */}
          {listingModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  List Prompt #{listingModal.tokenId} on Marketplace
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (IP tokens)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={listingForm.price}
                      onChange={(e) => setListingForm(prev => ({ ...prev, price: e.target.value }))}
                      className="input-field"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days)
                    </label>
                    <select
                      value={listingForm.duration}
                      onChange={(e) => setListingForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="input-field"
                    >
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>

                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <p><strong>Note:</strong> This will:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Approve the marketplace to transfer your NFT</li>
                      <li>Create a listing for {listingForm.duration} days</li>
                      <li>Accept payments in IP tokens (native currency)</li>
                      <li>Charge a 2.5% platform fee</li>
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setListingModal({ open: false })}
                    className="flex-1 btn-secondary py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateListing}
                    disabled={isApproving || isListing || isListingTxLoading || !listingForm.price}
                    className="flex-1 btn-primary py-2 disabled:opacity-50"
                  >
                    {isApproving || isListing || isListingTxLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isApproving ? 'Approving...' : 'Listing...'}
                      </div>
                    ) : (
                      'Create Listing'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
