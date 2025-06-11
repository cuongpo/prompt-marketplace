# Security Notice

## Environment Variables

This repository contains example environment files (`.env.example`) but **does not include actual environment files** for security reasons.

### Required Environment Setup

Before running the application, you must create the following environment files:

#### 1. Contracts Environment (`contracts/.env`)
Copy `contracts/.env.example` to `contracts/.env` and update with your values:
- `PRIVATE_KEY`: Your wallet private key (with 0x prefix)
- `ETHERSCAN_API_KEY`: Your Etherscan API key for contract verification
- `PINATA_API_KEY` & `PINATA_SECRET_KEY`: Your Pinata IPFS credentials
- `JWT_SECRET`: A secure random string for JWT token signing

#### 2. Backend Environment (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and update with your values:
- `DATABASE_URL`: Your PostgreSQL database connection string
- `JWT_SECRET`: Same as contracts (for consistency)
- `PINATA_API_KEY` & `PINATA_SECRET_KEY`: Your Pinata IPFS credentials
- `PRIVATE_KEY`: Your wallet private key (with 0x prefix)

#### 3. Frontend Environment (`frontend/.env.local`)
Copy `frontend/.env.example` to `frontend/.env.local` and update with your values:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID
- Contract addresses will be updated after deployment

## Sensitive Data Protection

The following files are automatically ignored by Git:
- `*.env`
- `*.env.local`
- `*.env.production`
- `*.env.development.local`
- `*.env.test.local`
- `node_modules/`
- Build outputs and cache directories

## Security Best Practices

1. **Never commit private keys or API keys** to version control
2. **Use different private keys** for development and production
3. **Rotate API keys regularly**
4. **Use environment-specific configurations**
5. **Keep dependencies updated**

## Getting API Keys

- **Pinata IPFS**: Sign up at [pinata.cloud](https://pinata.cloud)
- **WalletConnect**: Get project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com)
- **Etherscan**: Get API key at [etherscan.io/apis](https://etherscan.io/apis)

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainers directly instead of opening a public issue.
