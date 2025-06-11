import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const stats = [
  { name: 'Total Prompts', value: '12,543', change: '+12%', changeType: 'positive' },
  { name: 'Active Creators', value: '3,247', change: '+8%', changeType: 'positive' },
  { name: 'Total Volume', value: '$2.4M', change: '+23%', changeType: 'positive' },
  { name: 'Avg. Rating', value: '4.8/5', change: '+0.2', changeType: 'positive' },
]

export default function Stats() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-1" />
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Platform Statistics
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join a thriving ecosystem of AI creators and users
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  className="text-4xl font-bold text-gray-900 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-lg font-medium text-gray-600 mb-1">
                  {stat.name}
                </div>
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stat.changeType === 'positive'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {stat.changeType === 'positive' ? (
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional metrics */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-sm font-medium text-primary-700">
              Marketplace Availability
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-accent-600 mb-2">0%</div>
            <div className="text-sm font-medium text-accent-700">
              Platform Fees (Limited Time)
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-secondary-600 mb-2">∞</div>
            <div className="text-sm font-medium text-secondary-700">
              Scalability Potential
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
