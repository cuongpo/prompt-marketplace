# AI Prompt Marketplace

A decentralized platform built on Story Protocol for tokenizing, buying, selling, and licensing AI prompts as digital assets on the blockchain.

## 🌟 Overview

This platform enables creators to:
- **Tokenize AI prompts** as IP Assets using Story Protocol's infrastructure
- **Set licensing terms** and automated royalty structures
- **Trade prompts** in a decentralized marketplace
- **Earn revenue** from prompt usage and derivatives
- **Build communities** around AI creativity

## 🏗️ Architecture

### Smart Contracts (Foundry/Solidity)
- **AIPromptRegistry.sol** - Registers prompts as IP Assets on Story Protocol
- **PromptMarketplace.sol** - Handles buying/selling of prompt NFTs with multi-token support
- **PromptLicensing.sol** - Manages licensing terms and automated revenue sharing
- **Story Protocol Integration** - Leverages IP Asset Registry, Licensing Module, and Royalty Module

### Frontend (Next.js + React)
- **Modern Interface** - Responsive design with Tailwind CSS
- **Story Protocol SDK** - Direct integration with Story Protocol
- **Wallet Connectivity** - MetaMask, WalletConnect, and more via RainbowKit
- **IPFS Integration** - Decentralized storage for prompt metadata
- **Real-time Updates** - Live marketplace data and notifications

### Backend Services (Node.js + Express)
- **RESTful API** - Comprehensive API for data management
- **IPFS Pinning** - Reliable decentralized storage
- **Event Indexing** - Blockchain event monitoring and indexing
- **Analytics Engine** - Usage tracking and revenue analytics
- **Caching Layer** - Redis for performance optimization

## ✨ Key Features

### 🎨 For Creators
- **Easy Upload** - Intuitive prompt creation interface
- **Flexible Licensing** - Custom terms with automated enforcement
- **Revenue Tracking** - Real-time earnings and analytics
- **IP Protection** - Blockchain-based ownership proof
- **Community Building** - Creator profiles and following system

### 🛒 For Users
- **Advanced Search** - Filter by category, price, rating, and more
- **Secure Purchases** - Multi-token payment support (ETH, ERC20)
- **License Management** - Clear usage rights and restrictions
- **Usage Tracking** - Monitor your prompt usage and licenses
- **Rating System** - Community-driven quality assessment

### 🔧 For Developers
- **API Access** - RESTful API for integration
- **SDK Support** - Easy integration tools
- **Webhook Events** - Real-time notifications
- **Analytics Data** - Usage and performance metrics
- **Documentation** - Comprehensive guides and examples

## 🛠️ Technology Stack

### Blockchain & Smart Contracts
- **Story Protocol** - IP management and licensing infrastructure
- **Solidity** - Smart contract development
- **Foundry** - Development framework and testing
- **EVM Compatibility** - Works with Ethereum-compatible chains

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Wagmi & Viem** - Ethereum interactions
- **RainbowKit** - Wallet connection
- **Zustand** - State management

### Backend & Infrastructure
- **Node.js & Express** - Server-side runtime
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **IPFS** - Decentralized storage
- **Winston** - Logging
- **Jest** - Testing framework

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Foundry** (for smart contracts)
- **Git**
- **PostgreSQL** (for backend)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd prompt_marketplace
```

2. **Install dependencies:**
```bash
# Smart contracts
cd contracts
yarn install && forge install

# Frontend
cd ../frontend
npm install

# Backend
cd ../backend
npm install
```

3. **Environment setup:**
```bash
# Copy environment files
cp contracts/.env.example contracts/.env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit the files with your configuration
```

4. **Deploy smart contracts:**
```bash
cd contracts

# Local deployment (for development)
anvil # Start local blockchain
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Or deploy to Story testnet
forge script script/Deploy.s.sol --rpc-url $STORY_TESTNET_RPC --broadcast --verify
```

5. **Start development servers:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

6. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Blockchain Explorer: https://testnet.storyscan.xyz

## 📁 Project Structure

```
prompt_marketplace/
├── contracts/              # Smart contracts (Foundry)
│   ├── src/               # Contract source code
│   │   ├── AIPromptRegistry.sol
│   │   ├── PromptMarketplace.sol
│   │   └── PromptLicensing.sol
│   ├── test/              # Contract tests
│   ├── script/            # Deployment scripts
│   └── foundry.toml       # Foundry configuration
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── lib/           # Utilities and configs
│   │   └── styles/        # CSS styles
│   └── package.json
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   └── package.json
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── SETUP.md          # Setup guide
│   └── API.md            # API documentation
└── README.md
```

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
forge test                 # Run all tests
forge test -vvv           # Verbose output
forge coverage            # Coverage report
```

### Frontend
```bash
cd frontend
npm test                  # Run tests
npm run test:watch        # Watch mode
npm run build             # Production build
```

### Backend
```bash
cd backend
npm test                  # Run tests
npm run test:watch        # Watch mode
npm run lint              # Linting
```

## 📚 Documentation

- **[Setup Guide](docs/SETUP.md)** - Detailed setup instructions
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture overview
- **[API Documentation](docs/API.md)** - Backend API reference
- **[Smart Contracts](docs/CONTRACTS.md)** - Contract documentation
- **[Deployment](docs/DEPLOYMENT.md)** - Production deployment guide

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript/Solidity best practices
- Write comprehensive tests
- Update documentation
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Current)
- [x] Project architecture and setup
- [x] Smart contract development
- [x] Basic frontend interface
- [x] Story Protocol integration
- [x] Core marketplace functionality

### 🚧 Phase 2: Enhanced Features (Q1 2024)
- [ ] Advanced search and filtering
- [ ] User profiles and social features
- [ ] Mobile-responsive design
- [ ] Performance optimizations
- [ ] Security audits

### 🔮 Phase 3: Advanced Platform (Q2 2024)
- [ ] AI-powered recommendations
- [ ] Collaborative prompt creation
- [ ] Advanced analytics dashboard
- [ ] API marketplace
- [ ] Mobile applications

### 🌟 Phase 4: Ecosystem (Q3 2024)
- [ ] Governance token launch
- [ ] DAO implementation
- [ ] Cross-chain compatibility
- [ ] Enterprise features
- [ ] White-label solutions

## 🆘 Support & Community

- **Documentation**: [docs/](docs/)
- **Discord**: [Join our community](https://discord.gg/storybuilders)
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-org/prompt-marketplace/issues)
- **Twitter**: [@PromptMarketplace](https://twitter.com/promptmarketplace)
- **Email**: support@promptmarketplace.io

## 🙏 Acknowledgments

- **Story Protocol** - For the amazing IP infrastructure
- **Foundry** - For the excellent smart contract development tools
- **Next.js** - For the powerful React framework
- **The Community** - For feedback and contributions

---

**Built with ❤️ on Story Protocol**
