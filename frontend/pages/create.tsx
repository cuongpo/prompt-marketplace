import { useState, useEffect } from 'react'
import * as React from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import {
  DocumentTextIcon,
  TagIcon,
  CurrencyDollarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { CONTRACT_ADDRESSES, AI_PROMPT_REGISTRY_ABI, PROMPT_CATEGORIES } from '../lib/contracts'
import { uploadToIPFS, createPromptMetadata } from '../lib/ipfs'
import WalletStatus from '../components/WalletStatus'

export default function CreatePrompt() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    price: '',
    licenseType: 'commercial'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<'form' | 'uploading' | 'minting' | 'success'>('form')

  // Contract write hook for minting prompt
  const {
    data: mintData,
    write: mintPrompt,
    isLoading: isMintLoading,
    error: mintError
  } = useContractWrite({
    address: CONTRACT_ADDRESSES.AIPromptRegistry,
    abi: AI_PROMPT_REGISTRY_ABI,
    functionName: 'mintPrompt',
  })

  // Wait for transaction confirmation
  const {
    data: txReceipt,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess
  } = useWaitForTransaction({
    hash: mintData?.hash,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!formData.title || !formData.description || !formData.content || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setCurrentStep('uploading')

    try {
      // Step 1: Create and upload metadata to IPFS
      toast.loading('Uploading metadata to IPFS...', { id: 'upload' })

      const metadata = createPromptMetadata(formData)
      const tokenURI = await uploadToIPFS(metadata)

      toast.success('Metadata uploaded successfully!', { id: 'upload' })

      // Step 2: Mint the prompt NFT on blockchain
      setCurrentStep('minting')
      toast.loading('Minting prompt NFT...', { id: 'mint' })

      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)

      mintPrompt({
        args: [
          address, // to
          formData.title, // title
          formData.description, // description
          formData.category, // category
          tags, // tags
          tokenURI // _tokenURI
        ]
      })

    } catch (error) {
      console.error('Error creating prompt:', error)
      toast.error('Error creating prompt. Please try again.')
      setIsSubmitting(false)
      setCurrentStep('form')
    }
  }

  // Handle transaction completion
  React.useEffect(() => {
    if (isTxSuccess && txReceipt) {
      setCurrentStep('success')
      toast.success('Prompt created and tokenized successfully!', { id: 'mint' })

      // Reset form after success
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          content: '',
          category: '',
          tags: '',
          price: '',
          licenseType: 'commercial'
        })
        setIsSubmitting(false)
        setCurrentStep('form')
      }, 3000)
    }
  }, [isTxSuccess, txReceipt])

  // Handle mint error
  React.useEffect(() => {
    if (mintError) {
      console.error('Mint error:', mintError)
      toast.error('Failed to mint prompt. Please try again.', { id: 'mint' })
      setIsSubmitting(false)
      setCurrentStep('form')
    }
  }, [mintError])

  const categories = PROMPT_CATEGORIES

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>Create AI Prompt - AI Prompt Marketplace</title>
        <meta name="description" content="Create and tokenize your AI prompt on the decentralized marketplace" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <SparklesIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Create Your AI Prompt
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Transform your AI prompt into a valuable digital asset on Story Protocol
              </p>
              {mounted && isConnected && address && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Connected:</strong> {address.slice(0, 6)}...{address.slice(-4)} |
                    <strong> Network:</strong> Story Aeneid Testnet
                  </p>
                </div>
              )}
            </div>

            {/* Wallet Status */}
            <div className="mb-6">
              <WalletStatus />
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              {/* Process Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">What happens when you create a prompt:</h3>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Your prompt metadata is uploaded to IPFS for decentralized storage</li>
                  <li>2. An NFT is minted representing your prompt ownership</li>
                  <li>3. The NFT is registered as an IP Asset on Story Protocol</li>
                  <li>4. You can then list it on the marketplace or license it to others</li>
                </ol>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter a catchy title for your prompt"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Describe what your prompt does and its use cases"
                  />
                </div>

                {/* Prompt Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={6}
                    value={formData.content}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your AI prompt here..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter tags separated by commas (e.g., creative, marketing, copywriting)"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (IP tokens) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                {/* License Type */}
                <div>
                  <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700 mb-2">
                    License Type *
                  </label>
                  <select
                    id="licenseType"
                    name="licenseType"
                    required
                    value={formData.licenseType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="commercial">Commercial License</option>
                    <option value="personal">Personal Use Only</option>
                    <option value="attribution">Attribution Required</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  {mounted && !isConnected ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Please connect your wallet to create and tokenize prompts
                      </p>
                      <button
                        type="button"
                        className="w-full btn-secondary py-3 text-base font-medium"
                        onClick={() => toast.info('Please use the Connect Wallet button in the header')}
                      >
                        Connect Wallet Required
                      </button>
                    </div>
                  ) : mounted ? (
                    <button
                      type="submit"
                      disabled={isSubmitting || isMintLoading || isTxLoading}
                      className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {currentStep === 'uploading' && 'Uploading to IPFS...'}
                          {currentStep === 'minting' && 'Minting NFT...'}
                          {currentStep === 'success' && 'Success!'}
                        </div>
                      ) : (
                        'Create & Tokenize Prompt'
                      )}
                    </button>
                  ) : (
                    <div className="w-full btn-secondary py-3 text-base font-medium text-center">
                      Loading...
                    </div>
                  )}
                </div>
              </form>

              {/* Success Message */}
              {mounted && currentStep === 'success' && txReceipt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Prompt Successfully Tokenized!
                      </h3>
                      <p className="text-sm text-green-600 mt-1">
                        Your prompt has been minted as an NFT and registered as an IP Asset on Story Protocol.
                      </p>
                      <a
                        href={`https://aeneid.storyscan.xyz/tx/${txReceipt.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 underline hover:text-green-800 mt-1 inline-block"
                      >
                        View transaction on explorer →
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
