import { Router } from 'express'
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all prompts
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    // TODO: Implement database query
    const prompts = [
      {
        id: '1',
        title: 'Creative Writing Assistant',
        description: 'A prompt for generating creative stories',
        category: 'writing',
        price: '0.1',
        creator: '0x123...',
        tokenId: '1',
        ipfsHash: 'QmExample...',
        createdAt: new Date().toISOString(),
      },
    ]

    res.json({
      status: 'success',
      data: { prompts },
    })
  } catch (error) {
    console.error('Get prompts error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch prompts',
    })
  }
})

// Get prompt by ID
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    
    // TODO: Implement database query
    const prompt = {
      id,
      title: 'Creative Writing Assistant',
      description: 'A prompt for generating creative stories',
      category: 'writing',
      price: '0.1',
      creator: '0x123...',
      tokenId: '1',
      ipfsHash: 'QmExample...',
      createdAt: new Date().toISOString(),
    }

    res.json({
      status: 'success',
      data: { prompt },
    })
  } catch (error) {
    console.error('Get prompt error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch prompt',
    })
  }
})

// Create new prompt
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description, category, content, price } = req.body
    const creator = req.user!.address

    // TODO: Implement database insertion
    const prompt = {
      id: Date.now().toString(),
      title,
      description,
      category,
      content,
      price,
      creator,
      createdAt: new Date().toISOString(),
    }

    res.status(201).json({
      status: 'success',
      data: { prompt },
    })
  } catch (error) {
    console.error('Create prompt error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to create prompt',
    })
  }
})

export default router
