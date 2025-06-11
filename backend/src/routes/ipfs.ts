import { Router } from 'express'
import multer from 'multer'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Upload file to IPFS
router.post('/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file provided',
      })
    }

    // TODO: Implement IPFS upload using Pinata
    const mockHash = `Qm${Date.now()}${Math.random().toString(36).substr(2, 9)}`

    res.json({
      status: 'success',
      data: {
        hash: mockHash,
        url: `${process.env.IPFS_GATEWAY}${mockHash}`,
        size: req.file.size,
        type: req.file.mimetype,
      },
    })
  } catch (error) {
    console.error('IPFS upload error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload to IPFS',
    })
  }
})

// Upload JSON metadata to IPFS
router.post('/upload-json', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { metadata } = req.body

    if (!metadata) {
      return res.status(400).json({
        status: 'error',
        message: 'No metadata provided',
      })
    }

    // TODO: Implement IPFS JSON upload using Pinata
    const mockHash = `Qm${Date.now()}${Math.random().toString(36).substr(2, 9)}`

    res.json({
      status: 'success',
      data: {
        hash: mockHash,
        url: `${process.env.IPFS_GATEWAY}${mockHash}`,
        metadata,
      },
    })
  } catch (error) {
    console.error('IPFS JSON upload error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload metadata to IPFS',
    })
  }
})

// Get file from IPFS
router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params

    // TODO: Implement IPFS retrieval
    res.redirect(`${process.env.IPFS_GATEWAY}${hash}`)
  } catch (error) {
    console.error('IPFS get error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve from IPFS',
    })
  }
})

export default router
