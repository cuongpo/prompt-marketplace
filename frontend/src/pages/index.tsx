import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  CubeTransparentIcon, 
  BoltIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import Hero from '@/components/Hero'
import PromptGrid from '@/components/PromptGrid'
import Stats from '@/components/Stats'

const features = [
  {
    name: 'Tokenize AI Prompts',
    description: 'Transform your AI prompts into valuable digital assets using Story Protocol\'s IP infrastructure.',
    icon: SparklesIcon,
  },
  {
    name: 'Decentralized Marketplace',
    description: 'Buy, sell, and trade AI prompts in a trustless, decentralized environment.',
    icon: CubeTransparentIcon,
  },
  {
    name: 'Smart Licensing',
    description: 'Flexible licensing terms with automated royalty distribution and revenue sharing.',
    icon: BoltIcon,
  },
  {
    name: 'Analytics & Insights',
    description: 'Track your prompt performance, usage statistics, and revenue in real-time.',
    icon: ChartBarIcon,
  },
  {
    name: 'Community Driven',
    description: 'Join a vibrant community of AI creators, developers, and prompt engineers.',
    icon: UserGroupIcon,
  },
  {
    name: 'Secure & Transparent',
    description: 'Built on blockchain technology ensuring security, transparency, and immutable ownership.',
    icon: ShieldCheckIcon,
  },
]

export default function Home() {
  const [featuredPrompts, setFeaturedPrompts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch featured prompts
    const fetchFeaturedPrompts = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await fetch('/api/prompts/featured')
        // const data = await response.json()
        // setFeaturedPrompts(data)
        
        // Mock data for now
        setFeaturedPrompts([])
      } catch (error) {
        console.error('Error fetching featured prompts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPrompts()
  }, [])

  return (
    <>
      <Head>
        <title>AI Prompt Marketplace - Tokenize, Trade & License AI Prompts</title>
        <meta 
          name="description" 
          content="The first decentralized marketplace for AI prompts built on Story Protocol. Tokenize your prompts, earn royalties, and join the future of AI content creation." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h2 
                className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Why Choose Our Platform?
              </motion.h2>
              <motion.p 
                className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Built on Story Protocol, our platform provides the most advanced infrastructure 
                for AI prompt creators and users.
              </motion.p>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <feature.icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <Stats />

        {/* Featured Prompts Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h2 
                className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Featured Prompts
              </motion.h2>
              <motion.p 
                className="mt-4 text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Discover high-quality AI prompts from our community of creators
              </motion.p>
            </div>

            <div className="mt-12">
              <PromptGrid prompts={featuredPrompts} loading={loading} />
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/marketplace"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Explore All Prompts
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to Start Creating?
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of creators who are already monetizing their AI prompts 
              on our decentralized platform.
            </motion.p>
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                href="/create"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Create Your First Prompt
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors"
              >
                Browse Marketplace
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
