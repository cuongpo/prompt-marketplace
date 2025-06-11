import { Router } from 'express'
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Get marketplace listings
router.get('/listings', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { category, sortBy, order } = req.query

    // TODO: Implement database query with filters
    const listings = [
      {
        id: '1',
        promptId: '1',
        price: '0.1',
        currency: 'ETH',
        seller: '0x123...',
        isActive: true,
        createdAt: new Date().toISOString(),
        prompt: {
          title: 'Creative Writing Assistant',
          description: 'A prompt for generating creative stories',
          category: 'writing',
        },
      },
    ]

    res.json({
      status: 'success',
      data: { listings },
    })
  } catch (error) {
    console.error('Get listings error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch listings',
    })
  }
})

// Create marketplace listing
router.post('/listings', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { promptId, price, currency } = req.body
    const seller = req.user!.address

    // TODO: Implement database insertion
    const listing = {
      id: Date.now().toString(),
      promptId,
      price,
      currency,
      seller,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    res.status(201).json({
      status: 'success',
      data: { listing },
    })
  } catch (error) {
    console.error('Create listing error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to create listing',
    })
  }
})

// Purchase prompt
router.post('/purchase', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { listingId, transactionHash } = req.body
    const buyer = req.user!.address

    // TODO: Verify transaction and update database
    const purchase = {
      id: Date.now().toString(),
      listingId,
      buyer,
      transactionHash,
      purchasedAt: new Date().toISOString(),
    }

    res.status(201).json({
      status: 'success',
      data: { purchase },
    })
  } catch (error) {
    console.error('Purchase error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to process purchase',
    })
  }
})

export default router
