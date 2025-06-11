import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'
import PromptGrid from '../components/PromptGrid'
import { CONTRACT_ADDRESSES, PROMPT_MARKETPLACE_ABI, AI_PROMPT_REGISTRY_ABI } from '../lib/contracts'

export default function Marketplace() {
  const { address, isConnected } = useAccount()
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [mounted, setMounted] = useState(false)
  const [listings, setListings] = useState([])
  const [buyingListingId, setBuyingListingId] = useState<number | null>(null)

  // Try to read listing ID 1 to see if there are any listings
  const { data: listing1, isLoading: listing1Loading } = useContractRead({
    address: CONTRACT_ADDRESSES.PromptMarketplace,
    abi: PROMPT_MARKETPLACE_ABI,
    functionName: 'listings',
    args: [1n],
    enabled: mounted,
    watch: true,
  })

  // Try to read listing ID 2
  const { data: listing2 } = useContractRead({
    address: CONTRACT_ADDRESSES.PromptMarketplace,
    abi: PROMPT_MARKETPLACE_ABI,
    functionName: 'listings',
    args: [2n],
    enabled: mounted,
    watch: true,
  })

  // Try to read listing ID 3
  const { data: listing3 } = useContractRead({
    address: CONTRACT_ADDRESSES.PromptMarketplace,
    abi: PROMPT_MARKETPLACE_ABI,
    functionName: 'listings',
    args: [3n],
    enabled: mounted,
    watch: true,
  })

  // Buy prompt functionality
  const {
    data: buyData,
    write: buyPrompt,
    isLoading: isBuying,
    error: buyError
  } = useContractWrite({
    address: CONTRACT_ADDRESSES.PromptMarketplace,
    abi: PROMPT_MARKETPLACE_ABI,
    functionName: 'buyPrompt',
  })

  // Wait for buy transaction
  const {
    isLoading: isBuyTxLoading,
    isSuccess: isBuySuccess
  } = useWaitForTransaction({
    hash: buyData?.hash,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      processListings()
    }
  }, [mounted, listing1, listing2, listing3])

  // Handle buy success
  useEffect(() => {
    if (isBuySuccess && buyData) {
      toast.success(
        <div>
          <p>Prompt purchased successfully!</p>
          <div className="flex space-x-4 mt-2">
            <a
              href={`https://aeneid.storyscan.xyz/tx/${buyData.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View transaction →
            </a>
            <a
              href="/my-purchases"
              className="text-green-600 underline text-sm"
            >
              View purchases →
            </a>
          </div>
        </div>,
        { id: 'buy', duration: 8000 }
      )
      setBuyingListingId(null)
      // Refresh listings after purchase
      setTimeout(() => {
        processListings()
      }, 2000)
    }
  }, [isBuySuccess, buyData])

  // Handle buy error
  useEffect(() => {
    if (buyError) {
      console.error('Buy error:', buyError)
      toast.error('Failed to purchase prompt. Please try again.')
      setBuyingListingId(null)
    }
  }, [buyError])

  const processListings = () => {
    setLoading(true)
    try {
      const allListings = []

      // Check each listing and add if it's active
      if (listing1 && listing1[5] && listing1[1] > 0) { // isActive and tokenId > 0
        allListings.push({
          listingId: Number(listing1[0]),
          tokenId: Number(listing1[1]),
          seller: listing1[2],
          price: listing1[3],
          paymentToken: listing1[4],
          isActive: listing1[5],
          createdAt: Number(listing1[6]),
          expiresAt: Number(listing1[7])
        })
      }

      if (listing2 && listing2[5] && listing2[1] > 0) {
        allListings.push({
          listingId: Number(listing2[0]),
          tokenId: Number(listing2[1]),
          seller: listing2[2],
          price: listing2[3],
          paymentToken: listing2[4],
          isActive: listing2[5],
          createdAt: Number(listing2[6]),
          expiresAt: Number(listing2[7])
        })
      }

      if (listing3 && listing3[5] && listing3[1] > 0) {
        allListings.push({
          listingId: Number(listing3[0]),
          tokenId: Number(listing3[1]),
          seller: listing3[2],
          price: listing3[3],
          paymentToken: listing3[4],
          isActive: listing3[5],
          createdAt: Number(listing3[6]),
          expiresAt: Number(listing3[7])
        })
      }

      console.log('Found listings:', allListings)
      setListings(allListings)
      setPrompts(allListings) // For now, use listings as prompts
    } catch (error) {
      console.error('Error processing listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyPrompt = (listing: any) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet to purchase prompts')
      return
    }

    if (listing.seller.toLowerCase() === address.toLowerCase()) {
      toast.error('You cannot buy your own prompt')
      return
    }

    setBuyingListingId(listing.listingId)
    toast.loading('Purchasing prompt...', { id: 'buy' })

    try {
      buyPrompt({
        args: [BigInt(listing.listingId)],
        value: listing.price // Send the exact price as payment
      })
    } catch (error) {
      console.error('Error buying prompt:', error)
      toast.error('Failed to initiate purchase')
      setBuyingListingId(null)
    }
  }

  const categories = [
    'All Categories',
    'Text Generation',
    'Image Generation', 
    'Code Generation',
    'Creative Writing',
    'Business',
    'Education',
    'Entertainment',
    'Other'
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>Marketplace - AI Prompt Marketplace</title>
        <meta name="description" content="Browse and purchase AI prompts from creators around the world" />
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
                AI Prompt Marketplace
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Discover, purchase, and license high-quality AI prompts from creators worldwide
              </p>
            </motion.div>
          </div>
        </div>

        {/* Debug Info */}
        {mounted && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <details className="bg-gray-100 rounded p-3 text-xs">
              <summary className="cursor-pointer text-gray-600">Debug: Marketplace Data</summary>
              <div className="mt-2 space-y-1">
                <div><strong>Listing 1:</strong> {listing1 ? `Active: ${listing1[5]}, TokenID: ${listing1[1]?.toString()}` : 'Not found'}</div>
                <div><strong>Listing 2:</strong> {listing2 ? `Active: ${listing2[5]}, TokenID: ${listing2[1]?.toString()}` : 'Not found'}</div>
                <div><strong>Listing 3:</strong> {listing3 ? `Active: ${listing3[5]}, TokenID: ${listing3[1]?.toString()}` : 'Not found'}</div>
                <div><strong>Processed Listings:</strong> {listings.length}</div>
              </div>
            </details>
          </div>
        )}

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-field"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All Categories' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {loading || listing1Loading ? 'Loading...' : `${listings.length} listings found`}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {loading || listing1Loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading marketplace listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts listed yet</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory
                    ? 'Try adjusting your search or filters'
                    : 'The marketplace is ready for listings!'
                  }
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    <strong>How to list your prompt:</strong>
                  </p>
                  <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
                    <li>Create a prompt on the <a href="/create" className="underline">Create page</a></li>
                    <li>Go to <a href="/my-prompts" className="underline">My Prompts</a></li>
                    <li>Click "List on Marketplace" for your prompt</li>
                    <li>Set price and duration</li>
                    <li>Your prompt will appear here for others to buy!</li>
                  </ol>
                </div>
              </div>
            ) : (
              <>
                {!isConnected && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Connect your wallet</strong> to purchase prompts from the marketplace.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.listingId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Prompt #{listing.tokenId}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatEther(listing.price)} IP
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Seller:</span>
                          <span className="text-sm text-gray-900 font-mono">
                            {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Listing ID:</span>
                          <span className="text-sm text-gray-900">
                            #{listing.listingId}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Expires:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(listing.expiresAt * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <button
                          onClick={() => handleBuyPrompt(listing)}
                          disabled={!isConnected || isBuying || buyingListingId === listing.listingId || isBuyTxLoading}
                          className="flex-1 btn-primary py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {buyingListingId === listing.listingId ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Buying...
                            </div>
                          ) : (
                            <>
                              <ShoppingCartIcon className="h-4 w-4 mr-2" />
                              Buy Now
                            </>
                          )}
                        </button>
                        <button className="flex-1 btn-secondary py-2 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}
