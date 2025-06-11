import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-accent-100/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              The Future of{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                AI Prompt Trading
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tokenize, buy, sell, and license AI prompts as digital assets on the blockchain. 
            Built on Story Protocol for secure IP management and automated royalty distribution.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/marketplace"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore Marketplace
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Your First Prompt
            </Link>
          </motion.div>

          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors group">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-shadow mr-3">
                <PlayIcon className="h-5 w-5 ml-0.5" />
              </div>
              <span className="text-sm font-medium">Watch Demo</span>
            </button>
          </motion.div>
        </div>

        {/* Feature highlights */}
        <motion.div
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Secure Ownership</h3>
            <p className="mt-2 text-gray-600">Blockchain-based ownership with immutable proof of creation</p>
          </div>

          <div className="text-center">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full">
                <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Instant Royalties</h3>
            <p className="mt-2 text-gray-600">Automated revenue sharing with smart contract technology</p>
          </div>

          <div className="text-center">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Global Community</h3>
            <p className="mt-2 text-gray-600">Connect with creators and users from around the world</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
