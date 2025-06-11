import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { ethers } from 'ethers'

const router = Router()

// Verify wallet signature and generate JWT
router.post('/verify', async (req, res) => {
  try {
    const { address, signature, message } = req.body

    if (!address || !signature || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Address, signature, and message are required',
      })
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature)
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid signature',
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: address, address },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: address,
          address,
        },
      },
    })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
    })
  }
})

// Get nonce for signing
router.get('/nonce/:address', (req, res) => {
  const { address } = req.params
  const nonce = `Sign this message to authenticate with AI Prompt Marketplace: ${Date.now()}`
  
  res.json({
    status: 'success',
    data: { nonce },
  })
})

export default router
