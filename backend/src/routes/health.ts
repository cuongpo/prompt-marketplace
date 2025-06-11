import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Prompt Marketplace API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  })
})

export default router
