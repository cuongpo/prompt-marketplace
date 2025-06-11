# 🚀 AI Prompt Marketplace Deployment Guide

This guide will help you deploy your decentralized AI prompt marketplace built on Story Protocol.

## 📋 Prerequisites

### Required Tools
- **Node.js** 18+ 
- **npm** or **yarn**
- **Foundry** (for smart contracts)
- **Git**

### Required Accounts & Keys
- **Story Protocol Testnet** account with test tokens
- **Pinata** account for IPFS storage
- **WalletConnect** project ID (optional, for wallet connections)

## 🏗️ Project Structure

```
prompt_marketplace/
├── contracts/          # Smart contracts (Foundry)
├── backend/           # Node.js API server
├── frontend/          # Next.js web application
├── docs/             # Documentation
└── deploy.sh         # Deployment script
```

## 🔧 Quick Setup

### 1. Run the Deployment Script

```bash
./deploy.sh
```

This script will:
- Check dependencies
- Install all project dependencies
- Build and test smart contracts
- Set up development environment
- Start development servers

### 2. Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Install contract dependencies
cd contracts
yarn install && forge install

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🌐 Network Configuration

### Story Protocol Testnet
- **Chain ID**: 1513
- **RPC URL**: https://testnet.storyrpc.io
- **Explorer**: https://testnet.storyscan.xyz

### Get Testnet Tokens
1. Visit the Story Protocol faucet
2. Request test tokens for your wallet
3. Confirm tokens received before deployment

## 📝 Environment Configuration

### 1. Contracts (.env)
```bash
cd contracts
cp .env.example .env
```

Update with your values:
```env
PRIVATE_KEY=your_private_key_here
STORY_TESTNET_RPC=https://testnet.storyrpc.io
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 2. Backend (.env)
```bash
cd backend
cp .env.example .env
```

Update with your values:
```env
PORT=3001
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

### 3. Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
```

Update with your values:
```env
NEXT_PUBLIC_CHAIN_ID=1513
NEXT_PUBLIC_RPC_URL=https://testnet.storyrpc.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🚀 Deployment Steps

### 1. Deploy Smart Contracts

```bash
cd contracts

# Deploy to Story testnet
forge script script/Deploy.s.sol --rpc-url $STORY_TESTNET_RPC --broadcast --verify

# Or use the npm script
npm run deploy:testnet
```

### 2. Update Contract Addresses

After deployment, update the contract addresses in:
- `backend/.env`
- `frontend/.env.local`

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will be available at `http://localhost:3001`

### 4. Start Frontend Application

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔍 Verification

### Test the Deployment

1. **Smart Contracts**: Check on Story testnet explorer
2. **Backend API**: Visit `http://localhost:3001/health`
3. **Frontend**: Visit `http://localhost:3000`
4. **Wallet Connection**: Connect your wallet and test functionality

### Key Features to Test

- [ ] Wallet connection
- [ ] Prompt minting (NFT creation)
- [ ] Marketplace listing
- [ ] License purchasing
- [ ] IPFS metadata storage

## 🌍 Production Deployment

### Smart Contracts
- Deploy to Story mainnet
- Verify contracts on explorer
- Set up monitoring

### Backend
- Deploy to cloud provider (AWS, GCP, Vercel)
- Set up production database
- Configure environment variables
- Set up monitoring and logging

### Frontend
- Deploy to Vercel, Netlify, or similar
- Configure production environment variables
- Set up custom domain
- Enable analytics

## 🛠️ Troubleshooting

### Common Issues

1. **Contract Build Fails**
   ```bash
   cd contracts
   forge clean
   forge build
   ```

2. **Network Connection Issues**
   - Check RPC URL
   - Verify network configuration
   - Ensure sufficient gas

3. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf .next node_modules
   npm install
   npm run build
   ```

### Getting Help

- Check the [documentation](./docs/)
- Review contract tests for examples
- Check network status and gas prices

## 📚 Additional Resources

- [Story Protocol Documentation](https://docs.story.foundation/)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)

## 🎯 Next Steps

After successful deployment:

1. **Test thoroughly** on testnet
2. **Gather user feedback**
3. **Optimize gas usage**
4. **Plan mainnet deployment**
5. **Set up monitoring and analytics**

---

🎉 **Congratulations!** Your AI Prompt Marketplace is now deployed and ready for use!
