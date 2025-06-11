import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Prompt {
  id: string
  title: string
  description: string
  category: string
  price: string
  rating: number
  ratingCount: number
  usageCount: number
  creator: {
    name: string
    avatar: string
  }
  image?: string
  tags: string[]
}

interface PromptGridProps {
  prompts: Prompt[]
  loading?: boolean
  viewMode?: 'grid' | 'list'
}

export default function PromptGrid({ prompts, loading = false, viewMode = 'grid' }: PromptGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No prompts found</h3>
        <p className="mt-2 text-gray-500">
          Be the first to create and share an AI prompt!
        </p>
        <div className="mt-6">
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Create Prompt
          </Link>
        </div>
      </div>
    )
  }

  const gridClasses = viewMode === 'grid'
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    : "space-y-4"

  return (
    <div className={gridClasses}>
      {prompts.map((prompt, index) => (
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/prompt/${prompt.id}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-50 to-accent-50">
                {prompt.image ? (
                  <Image
                    src={prompt.image}
                    alt={prompt.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-4xl font-bold text-gray-300">
                      {prompt.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                    {prompt.category}
                  </span>
                </div>

                {/* Like button */}
                <div className="absolute top-3 right-3">
                  <button className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <HeartIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {prompt.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {prompt.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {prompt.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{prompt.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {/* Rating */}
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(prompt.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-600">
                        ({prompt.ratingCount})
                      </span>
                    </div>

                    {/* Usage count */}
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                      <span className="ml-1 text-xs text-gray-600">
                        {prompt.usageCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Creator and Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image
                      src={prompt.creator.avatar}
                      alt={prompt.creator.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {prompt.creator.name}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-primary-600">
                    {prompt.price}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
