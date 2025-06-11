import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// Get user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const address = req.user!.address

    // TODO: Implement database query
    const user = {
      id: address,
      address,
      username: null,
      email: null,
      bio: null,
      avatar: null,
      createdAt: new Date().toISOString(),
      stats: {
        promptsCreated: 0,
        promptsPurchased: 0,
        totalEarnings: '0',
        totalSpent: '0',
      },
    }

    res.json({
      status: 'success',
      data: { user },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
    })
  }
})

// Update user profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const address = req.user!.address
    const { username, email, bio, avatar } = req.body

    // TODO: Implement database update
    const user = {
      id: address,
      address,
      username,
      email,
      bio,
      avatar,
      updatedAt: new Date().toISOString(),
    }

    res.json({
      status: 'success',
      data: { user },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
    })
  }
})

// Get user's prompts
router.get('/prompts', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const address = req.user!.address

    // TODO: Implement database query
    const prompts = []

    res.json({
      status: 'success',
      data: { prompts },
    })
  } catch (error) {
    console.error('Get user prompts error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user prompts',
    })
  }
})

export default router
