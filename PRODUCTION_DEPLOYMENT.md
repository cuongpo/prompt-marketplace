# 🚀 Production Deployment Guide

## Overview
This guide will help you deploy your AI Prompt Marketplace to production environments.

## 📋 Prerequisites

### Required Accounts & Services
- [ ] **Vercel Account** (for frontend deployment)
- [ ] **Railway/Heroku Account** (for backend deployment)
- [ ] **PostgreSQL Database** (Supabase/PlanetScale recommended)
- [ ] **Story Protocol Testnet Tokens** (for contract deployment)
- [ ] **Domain Name** (optional, for custom domain)

### Required API Keys
- [ ] **Pinata API Keys** (for IPFS storage)
- [ ] **WalletConnect Project ID** (for wallet connections)
- [ ] **Database Connection String**

## 🔧 Step 1: Deploy Smart Contracts

### Get Testnet Tokens
1. Visit Story Protocol faucet
2. Request tokens for address: `0x7E22eF3C47Bfc99344D070993ADB07d5D6BE2372`
3. Wait for confirmation

### Deploy Contracts
```bash
cd contracts
source .env
~/.foundry/bin/forge script script/Deploy.s.sol \
  --rpc-url $STORY_TESTNET_RPC \
  --broadcast \
  --verify
```

### Update Contract Addresses
After deployment, update these files with the deployed contract addresses:
- `backend/.env`
- `frontend/.env.local`

## 🗄️ Step 2: Set Up Database

### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in backend/.env

### Option B: PlanetScale
1. Go to [planetscale.com](https://planetscale.com)
2. Create new database
3. Copy connection string
4. Update `DATABASE_URL` in backend/.env

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  address VARCHAR(42) UNIQUE NOT NULL,
  username VARCHAR(50),
  email VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Prompts table
CREATE TABLE prompts (
  id SERIAL PRIMARY KEY,
  token_id INTEGER UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(50),
  price DECIMAL(18,8),
  creator_address VARCHAR(42) NOT NULL,
  ipfs_hash VARCHAR(100),
  metadata_uri TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  from_address VARCHAR(42) NOT NULL,
  to_address VARCHAR(42) NOT NULL,
  prompt_id INTEGER REFERENCES prompts(id),
  amount DECIMAL(18,8),
  type VARCHAR(20) NOT NULL, -- 'mint', 'purchase', 'license'
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🖥️ Step 3: Deploy Backend

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder
4. Add environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   PINATA_API_KEY=your_pinata_key
   PINATA_SECRET_KEY=your_pinata_secret
   STORY_TESTNET_RPC=https://testnet.storyrpc.io
   PROMPT_REGISTRY_ADDRESS=deployed_contract_address
   MARKETPLACE_ADDRESS=deployed_contract_address
   LICENSING_ADDRESS=deployed_contract_address
   ```
5. Deploy

### Option B: Heroku
1. Install Heroku CLI
2. Create new app:
   ```bash
   cd backend
   heroku create your-app-name
   ```
3. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DATABASE_URL=your_database_url
   # ... add all other env vars
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

## 🌐 Step 4: Deploy Frontend

### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `frontend` folder
4. Add environment variables:
   ```
   NEXT_PUBLIC_CHAIN_ID=1513
   NEXT_PUBLIC_RPC_URL=https://testnet.storyrpc.io
   NEXT_PUBLIC_EXPLORER_URL=https://testnet.storyscan.xyz
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_PROMPT_REGISTRY_ADDRESS=deployed_contract_address
   NEXT_PUBLIC_MARKETPLACE_ADDRESS=deployed_contract_address
   NEXT_PUBLIC_LICENSING_ADDRESS=deployed_contract_address
   NEXT_PUBLIC_API_URL=your_backend_url
   ```
5. Deploy

### Option B: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy

## 🔗 Step 5: Configure Domain & SSL

### Custom Domain (Optional)
1. Purchase domain from registrar
2. Add domain to Vercel/Netlify
3. Update DNS records
4. SSL certificates are automatically provisioned

### Update CORS Settings
Update backend CORS to allow your frontend domain:
```javascript
app.use(cors({
  origin: ['https://your-domain.com', 'http://localhost:3000'],
  credentials: true
}));
```

## 🧪 Step 6: Testing

### Test Checklist
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Wallet connection works
- [ ] Contract interactions work
- [ ] Database operations work
- [ ] IPFS uploads work
- [ ] All pages load correctly
- [ ] Mobile responsiveness

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Test backend API
artillery quick --count 10 --num 5 https://your-backend-url/health
```

## 📊 Step 7: Monitoring & Analytics

### Set Up Monitoring
1. **Sentry** for error tracking
2. **LogRocket** for user sessions
3. **Uptime Robot** for uptime monitoring

### Analytics
1. **Google Analytics** for web analytics
2. **Mixpanel** for user behavior
3. **Custom dashboard** for business metrics

## 🔒 Step 8: Security

### Security Checklist
- [ ] Environment variables secured
- [ ] API rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] HTTPS enforced
- [ ] Security headers configured

### Backup Strategy
- [ ] Database backups automated
- [ ] Code repository backed up
- [ ] Environment variables documented
- [ ] Recovery procedures documented

## 🚀 Step 9: Go Live

### Pre-Launch Checklist
- [ ] All tests passing
- [ ] Performance optimized
- [ ] SEO configured
- [ ] Social media cards set up
- [ ] Documentation complete
- [ ] Support channels ready

### Launch Day
1. Deploy to production
2. Monitor for issues
3. Announce launch
4. Gather user feedback
5. Monitor metrics

## 📈 Step 10: Post-Launch

### Ongoing Tasks
- [ ] Monitor performance
- [ ] Update dependencies
- [ ] Add new features
- [ ] Scale infrastructure
- [ ] Optimize costs

### Scaling Considerations
- **Database**: Consider read replicas
- **Backend**: Horizontal scaling
- **Frontend**: CDN optimization
- **Contracts**: Gas optimization

---

## 🆘 Troubleshooting

### Common Issues
1. **Contract deployment fails**: Check testnet tokens and network
2. **Database connection fails**: Verify connection string
3. **Frontend build fails**: Check environment variables
4. **API calls fail**: Check CORS and backend URL

### Support Resources
- [Story Protocol Docs](https://docs.story.foundation/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)

---

🎉 **Congratulations!** Your AI Prompt Marketplace is now live in production!
