#!/bin/bash

# AI Prompt Marketplace - Production Deployment Script
echo "🚀 Deploying AI Prompt Marketplace to Production..."

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

# Check if required tools are installed
check_tools() {
    print_status "Checking required tools..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "All required tools are installed"
}

# Deploy to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    cd frontend
    
    # Install Vercel CLI if not installed
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Build the project
    print_status "Building frontend..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend build successful"
        
        # Deploy to Vercel
        print_status "Deploying to Vercel..."
        vercel --prod
        
        if [ $? -eq 0 ]; then
            print_success "Frontend deployed to Vercel successfully!"
        else
            print_error "Vercel deployment failed"
        fi
    else
        print_error "Frontend build failed"
    fi
    
    cd ..
}

# Deploy to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    cd backend
    
    # Install Railway CLI if not installed
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Build the project
    print_status "Building backend..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Backend build successful"
        
        # Deploy to Railway
        print_status "Deploying to Railway..."
        railway deploy
        
        if [ $? -eq 0 ]; then
            print_success "Backend deployed to Railway successfully!"
        else
            print_error "Railway deployment failed"
        fi
    else
        print_error "Backend build failed"
    fi
    
    cd ..
}

# Deploy contracts to testnet
deploy_contracts() {
    print_status "Deploying contracts to Story testnet..."
    
    cd contracts
    source .env
    
    # Check if wallet has balance
    print_status "Checking wallet balance..."
    WALLET_ADDRESS=$(~/.foundry/bin/cast wallet address --private-key $PRIVATE_KEY 2>/dev/null || echo "")
    
    if [ -z "$WALLET_ADDRESS" ]; then
        print_error "Failed to get wallet address. Check your private key."
        cd ..
        return 1
    fi
    
    print_status "Wallet address: $WALLET_ADDRESS"
    
    # Try to deploy
    print_status "Deploying contracts..."
    ~/.foundry/bin/forge script script/Deploy.s.sol \
        --rpc-url $STORY_TESTNET_RPC \
        --broadcast \
        --verify \
        -vvv
    
    if [ $? -eq 0 ]; then
        print_success "Contracts deployed successfully!"
        print_status "Update your environment files with the deployed contract addresses"
    else
        print_warning "Contract deployment failed. You may need testnet tokens."
        print_status "Get testnet tokens from Story Protocol faucet for address: $WALLET_ADDRESS"
    fi
    
    cd ..
}

# Setup database
setup_database() {
    print_status "Database setup instructions..."
    
    echo ""
    print_warning "Manual database setup required:"
    echo "1. Create a PostgreSQL database (Supabase/PlanetScale recommended)"
    echo "2. Run the SQL schema from PRODUCTION_DEPLOYMENT.md"
    echo "3. Update DATABASE_URL in your backend environment variables"
    echo ""
}

# Main deployment menu
main_menu() {
    echo "🎯 AI Prompt Marketplace - Production Deployment"
    echo ""
    echo "Choose deployment option:"
    echo "1) Deploy everything (contracts + backend + frontend)"
    echo "2) Deploy contracts only"
    echo "3) Deploy backend only"
    echo "4) Deploy frontend only"
    echo "5) Setup database"
    echo "6) Exit"
    echo ""
    
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            print_status "Deploying everything..."
            deploy_contracts
            setup_database
            deploy_backend
            deploy_frontend
            ;;
        2)
            deploy_contracts
            ;;
        3)
            deploy_backend
            ;;
        4)
            deploy_frontend
            ;;
        5)
            setup_database
            ;;
        6)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            main_menu
            ;;
    esac
}

# Pre-deployment checks
pre_deployment_checks() {
    print_status "Running pre-deployment checks..."
    
    # Check if .env files exist
    if [ ! -f "contracts/.env" ]; then
        print_error "contracts/.env file not found"
        exit 1
    fi
    
    if [ ! -f "backend/.env" ]; then
        print_error "backend/.env file not found"
        exit 1
    fi
    
    if [ ! -f "frontend/.env.local" ]; then
        print_error "frontend/.env.local file not found"
        exit 1
    fi
    
    print_success "Pre-deployment checks passed"
}

# Main execution
main() {
    echo "🚀 Welcome to AI Prompt Marketplace Production Deployment"
    echo ""
    
    check_tools
    pre_deployment_checks
    main_menu
    
    echo ""
    print_success "🎉 Deployment process completed!"
    echo ""
    echo "📖 Next steps:"
    echo "1. Update contract addresses in environment files if contracts were deployed"
    echo "2. Set up your database using the schema in PRODUCTION_DEPLOYMENT.md"
    echo "3. Configure custom domains if needed"
    echo "4. Set up monitoring and analytics"
    echo ""
    echo "📚 Documentation:"
    echo "- Full deployment guide: PRODUCTION_DEPLOYMENT.md"
    echo "- Current status: DEPLOYMENT_STATUS.md"
    echo ""
    echo "🔗 Useful links:"
    echo "- Story Protocol: https://docs.story.foundation/"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo "- Railway Dashboard: https://railway.app/dashboard"
}

# Run main function
main
