# 🚀 AI Prompt Marketplace

A decentralized marketplace built on Story Protocol for tokenizing, buying, selling, and licensing AI prompts as NFTs.

![License](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-Story%20Protocol-orange) ![Status](https://img.shields.io/badge/status-Beta-green)

## 💡 Overview

The AI Prompt Marketplace enables creators to monetize their AI prompts through blockchain technology:

- ✅ **Tokenize prompts** as IP Assets on Story Protocol
- ✅ **Define licensing terms** with automated royalties
- ✅ **Trade prompts** securely in a decentralized marketplace
- ✅ **Track revenue** from prompt usage and derivatives
- ✅ **Build community** around AI creativity

## 🏗️ Architecture

| Component | Technology | Key Features |
|-----------|------------|-------------|
| **Smart Contracts** | Foundry/Solidity | AIPromptRegistry, PromptMarketplace, PromptLicensing |
| **Frontend** | Next.js/React | Responsive UI, Wallet Integration, IPFS Storage |
| **Backend** | Node.js/Express | RESTful API, Event Indexing, Analytics |

## 🛠️ Tech Stack

- **Blockchain**: Story Protocol, Solidity, Foundry
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, RainbowKit
- **Backend**: Node.js, Express, PostgreSQL, Redis, IPFS
- **DevOps**: GitHub Actions, Docker, AWS/Render

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Foundry
- Git
- PostgreSQL

### One-Command Setup

```bash
# Clone and install dependencies
git clone <repository-url> && cd prompt_marketplace
./deploy.sh development
```

### Manual Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url> && cd prompt_marketplace

# Install contract dependencies
cd contracts && yarn install && forge install

# Install frontend dependencies
cd ../frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

2. **Configure environment:**
```bash
# Copy and edit environment files
cp contracts/.env.example contracts/.env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

3. **Launch development environment:**
```bash
# Start local blockchain
cd contracts && anvil

# Deploy contracts (in new terminal)
cd contracts
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Start backend (in new terminal)
cd backend && npm run dev

# Start frontend (in new terminal)
cd frontend && npm run dev
```

4. **Access your application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📊 Key Features

| For Creators | For Users | For Developers |
|--------------|-----------|----------------|
| Easy prompt tokenization | Advanced search & discovery | API access & SDK |
| Custom licensing terms | Secure multi-token payments | Webhooks & events |
| Revenue analytics | License management | Performance metrics |
| IP protection | Usage tracking | Comprehensive docs |
| Creator profiles | Community ratings | Integration guides |

## 📁 Project Structure

```
prompt_marketplace/
├── contracts/              # Smart contracts
├── frontend/              # Next.js frontend
├── backend/               # Node.js backend
├── docs/                  # Documentation
└── deploy.sh              # Deployment scripts
```

## 🧪 Testing

```bash
# Test smart contracts
cd contracts && forge test

# Test frontend
cd frontend && npm test

# Test backend
cd backend && npm test
```

## 📚 Documentation

- [Setup Guide](docs/SETUP.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📅 Roadmap

- **Q2 2024**: Enhanced search, user profiles, mobile design
- **Q3 2024**: AI recommendations, analytics dashboard, API marketplace
- **Q4 2024**: Governance token, DAO implementation, cross-chain support

## 🆘 Support

- **Docs**: [docs/](docs/)
- **Discord**: [Join community](https://discord.gg/storybuilders)
- **Issues**: [GitHub Issues](https://github.com/your-org/prompt-marketplace/issues)

---

**Built with ❤️ on Story Protocol**
