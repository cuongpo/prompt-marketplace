#!/bin/bash

# AI Prompt Marketplace - Testnet Deployment Script
echo "🚀 Deploying AI Prompt Marketplace to Story Protocol Testnet..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment variables are set
check_env() {
    print_status "Checking environment variables..."
    
    cd contracts
    source .env
    
    if [ -z "$PRIVATE_KEY" ]; then
        print_error "PRIVATE_KEY not set in contracts/.env"
        exit 1
    fi
    
    if [ -z "$STORY_TESTNET_RPC" ]; then
        print_error "STORY_TESTNET_RPC not set in contracts/.env"
        exit 1
    fi
    
    print_success "Environment variables configured"
}

# Check wallet balance
check_balance() {
    print_status "Checking wallet balance..."
    
    WALLET_ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY)
    print_status "Wallet address: $WALLET_ADDRESS"
    
    BALANCE=$(cast balance --rpc-url $STORY_TESTNET_RPC $WALLET_ADDRESS 2>/dev/null || echo "0")
    
    if [ "$BALANCE" = "0" ]; then
        print_warning "Wallet balance is 0. You need testnet tokens to deploy."
        print_status "Get testnet tokens from Story Protocol faucet"
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "Wallet has balance: $BALANCE wei"
    fi
}

# Deploy contracts
deploy_contracts() {
    print_status "Deploying smart contracts to Story testnet..."

    # Build contracts first
    ~/.foundry/bin/forge build
    if [ $? -ne 0 ]; then
        print_error "Contract build failed"
        exit 1
    fi

    # Try to deploy contracts
    print_status "Running deployment script..."
    ~/.foundry/bin/forge script script/Deploy.s.sol \
        --rpc-url $STORY_TESTNET_RPC \
        --broadcast \
        --verify \
        --etherscan-api-key $ETHERSCAN_API_KEY \
        -vvvv

    if [ $? -eq 0 ]; then
        print_success "Contracts deployed successfully!"
        print_status "Check the deployment on Story testnet explorer:"
        print_status "https://testnet.storyscan.xyz"
    else
        print_warning "Network deployment failed. Contracts are ready for manual deployment."
        print_status "You can deploy manually when network is available using:"
        print_status "cd contracts && ~/.foundry/bin/forge script script/Deploy.s.sol --rpc-url \$STORY_TESTNET_RPC --broadcast"
    fi
}

# Update environment files with deployed addresses
update_env_files() {
    print_status "Updating environment files with contract addresses..."
    
    # This would need to parse the deployment output to get actual addresses
    print_warning "Manual step required:"
    print_status "1. Copy deployed contract addresses from the output above"
    print_status "2. Update backend/.env with contract addresses"
    print_status "3. Update frontend/.env.local with contract addresses"
    
    print_status "Example format:"
    echo "NEXT_PUBLIC_PROMPT_REGISTRY_ADDRESS=0x..."
    echo "NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x..."
    echo "NEXT_PUBLIC_LICENSING_ADDRESS=0x..."
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test backend
    print_status "Testing backend API..."
    if curl -s http://localhost:3001/health > /dev/null; then
        print_success "Backend API is running"
    else
        print_warning "Backend API is not running. Start with: cd backend && npm run dev"
    fi
    
    # Test frontend
    print_status "Testing frontend..."
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Frontend is running"
    else
        print_warning "Frontend is not running. Start with: cd frontend && npm run dev"
    fi
}

# Main deployment flow
main() {
    echo "🎯 AI Prompt Marketplace - Testnet Deployment"
    echo "📋 This script will deploy your contracts to Story Protocol testnet"
    echo ""
    
    check_env
    check_balance
    deploy_contracts
    update_env_files
    test_deployment
    
    echo ""
    print_success "🎉 Testnet deployment complete!"
    echo ""
    echo "📖 Next steps:"
    echo "1. Update contract addresses in environment files"
    echo "2. Test all functionality on testnet"
    echo "3. Prepare for mainnet deployment"
    echo ""
    echo "🔗 Useful links:"
    echo "- Story Testnet Explorer: https://testnet.storyscan.xyz"
    echo "- Story Protocol Docs: https://docs.story.foundation/"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:3001"
}

# Run main function
main
