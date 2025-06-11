# Setup Guide

This guide will help you set up the AI Prompt Marketplace locally for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Foundry** (for smart contract development)

### Installing Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Project Structure

```
prompt_marketplace/
├── contracts/              # Smart contracts (Foundry)
├── frontend/               # Next.js frontend
├── backend/                # Node.js backend
├── docs/                   # Documentation
└── README.md
```

## 1. Clone the Repository

```bash
git clone <repository-url>
cd prompt_marketplace
```

## 2. Smart Contracts Setup

### Install Dependencies

```bash
cd contracts
yarn install
forge install
```

### Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs
STORY_TESTNET_RPC=https://testnet.storyrpc.io
STORY_MAINNET_RPC=https://story-network.rpc.caldera.xyz/http

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Story Protocol Contract Addresses (update with actual addresses)
IP_ASSET_REGISTRY=0x1a9d0d28a0422F26D31Be72Edc6f13ea4371E11B
LICENSING_MODULE=0x5a7D9Fa17DE09350F481A53B470D798c1c1aabae
LICENSE_TOKEN=0x1C93F3cF930d1d1B3eC45C7b0C8E0Bb8b8F8b8F8
ROYALTY_MODULE=0x2C93F3cF930d1d1B3eC45C7b0C8E0Bb8b8F8b8F8
PIL_TEMPLATE=0x3C93F3cF930d1d1B3eC45C7b0C8E0Bb8b8F8b8F8
SPG_NFT=0x4C93F3cF930d1d1B3eC45C7b0C8E0Bb8b8F8b8F8

# Platform Configuration
FEE_RECIPIENT=0x742d35Cc6634C0532925a3b8D0C9e3e0C8b8b8F8
PLATFORM_FEE_BPS=250
```

### Build and Test Contracts

```bash
# Build contracts
forge build

# Run tests
forge test

# Run tests with verbose output
forge test -vvv

# Check coverage
forge coverage
```

### Deploy Contracts (Local)

```bash
# Start local blockchain
anvil

# Deploy to local network (in another terminal)
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Deploy to Story Testnet

```bash
# Deploy to Story testnet
forge script script/Deploy.s.sol --rpc-url $STORY_TESTNET_RPC --broadcast --verify
```

## 3. Frontend Setup

### Install Dependencies

```bash
cd ../frontend
npm install
```

### Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=1513
NEXT_PUBLIC_RPC_URL=https://testnet.storyrpc.io
NEXT_PUBLIC_EXPLORER_URL=https://testnet.storyscan.xyz

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract Addresses (update after deployment)
NEXT_PUBLIC_PROMPT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_LICENSING_ADDRESS=0x...

# IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## 4. Backend Setup

### Install Dependencies

```bash
cd ../backend
npm install
```

### Environment Configuration

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/prompt_marketplace

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# IPFS Configuration
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Blockchain Configuration
RPC_URL=https://testnet.storyrpc.io
CHAIN_ID=1513

# Contract Addresses
PROMPT_REGISTRY_ADDRESS=0x...
MARKETPLACE_ADDRESS=0x...
LICENSING_ADDRESS=0x...

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
```

### Database Setup

If using PostgreSQL:

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb prompt_marketplace

# Run migrations (if using Prisma)
npx prisma migrate dev
npx prisma generate
```

### Start Development Server

```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`.

## 5. IPFS Setup (Optional)

For decentralized storage, you can use Pinata or run a local IPFS node.

### Using Pinata

1. Sign up at [Pinata](https://pinata.cloud/)
2. Get your API keys
3. Add them to your environment files

### Local IPFS Node

```bash
# Install IPFS
npm install -g ipfs

# Initialize IPFS
ipfs init

# Start IPFS daemon
ipfs daemon
```

## 6. Development Workflow

### Starting All Services

1. **Contracts**: Deploy to local network or testnet
2. **Backend**: `cd backend && npm run dev`
3. **Frontend**: `cd frontend && npm run dev`

### Making Changes

1. **Smart Contracts**: 
   - Make changes in `contracts/src/`
   - Run tests: `forge test`
   - Redeploy if needed

2. **Frontend**:
   - Make changes in `frontend/src/`
   - Hot reload will update automatically

3. **Backend**:
   - Make changes in `backend/src/`
   - Nodemon will restart automatically

## 7. Testing

### Smart Contracts

```bash
cd contracts
forge test
forge coverage
```

### Frontend

```bash
cd frontend
npm test
npm run test:watch
```

### Backend

```bash
cd backend
npm test
npm run test:watch
```

## 8. Common Issues

### Foundry Installation Issues

If you encounter issues with Foundry:

```bash
# Update Foundry
foundryup

# Install specific version
foundryup --version nightly
```

### Node Version Issues

Ensure you're using Node.js v18+:

```bash
node --version
# If using nvm
nvm use 18
```

### Contract Deployment Issues

1. Check your private key is correct
2. Ensure you have testnet tokens
3. Verify RPC URL is accessible
4. Check gas settings

### Frontend Connection Issues

1. Verify contract addresses are correct
2. Check network configuration
3. Ensure wallet is connected to correct network

## 9. Getting Testnet Tokens

To interact with the Story testnet, you'll need testnet tokens:

1. Visit the Story Protocol faucet (when available)
2. Connect your wallet
3. Request testnet tokens

## 10. Next Steps

Once you have the development environment set up:

1. Explore the codebase
2. Run the test suite
3. Try creating a prompt
4. Test the marketplace functionality
5. Check the analytics dashboard

## 11. Production Deployment

For production deployment, see the deployment guides:

- [Frontend Deployment](./DEPLOYMENT_FRONTEND.md)
- [Backend Deployment](./DEPLOYMENT_BACKEND.md)
- [Contract Deployment](./DEPLOYMENT_CONTRACTS.md)

## Support

If you encounter issues:

1. Check the [troubleshooting guide](./TROUBLESHOOTING.md)
2. Review the [FAQ](./FAQ.md)
3. Join our [Discord](https://discord.gg/storybuilders)
4. Create an issue on GitHub
