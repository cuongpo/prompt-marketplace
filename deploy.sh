#!/bin/bash

# AI Prompt Marketplace Deployment Script
echo "🚀 Starting AI Prompt Marketplace Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    if ! command -v forge &> /dev/null; then
        print_error "Foundry is not installed. Please install Foundry"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install project dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Install contract dependencies
    print_status "Installing contract dependencies..."
    cd contracts
    if [ -f "package.json" ]; then
        yarn install
    fi
    forge install
    cd ..
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "All dependencies installed"
}

# Build and test contracts
build_contracts() {
    print_status "Building and testing smart contracts..."
    cd contracts
    
    # Build contracts
    forge build
    if [ $? -ne 0 ]; then
        print_error "Contract build failed"
        exit 1
    fi
    
    # Run tests
    forge test
    if [ $? -ne 0 ]; then
        print_error "Contract tests failed"
        exit 1
    fi
    
    cd ..
    print_success "Contracts built and tested successfully"
}

# Deploy contracts (local for now)
deploy_contracts() {
    print_status "Deploying contracts..."
    cd contracts
    
    # For now, we'll just prepare for deployment
    # In a real deployment, you would run:
    # forge script script/Deploy.s.sol --rpc-url $STORY_TESTNET_RPC --broadcast --verify
    
    print_warning "Contract deployment to testnet requires network access and testnet tokens"
    print_status "Contracts are ready for deployment when network is available"
    
    cd ..
}

# Start development servers
start_dev_servers() {
    print_status "Starting development servers..."
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend in background
    print_status "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Development servers started!"
    print_status "Backend running on: http://localhost:3001"
    print_status "Frontend running on: http://localhost:3000"
    print_status "Press Ctrl+C to stop all servers"
    
    # Wait for user to stop
    trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT
    wait
}

# Main deployment flow
main() {
    echo "🎯 AI Prompt Marketplace - Decentralized AI Prompt Trading Platform"
    echo "📋 This script will set up your development environment"
    echo ""
    
    check_dependencies
    install_dependencies
    build_contracts
    deploy_contracts
    
    echo ""
    print_success "🎉 Setup complete!"
    echo ""
    echo "📖 Next steps:"
    echo "1. Get testnet tokens for deployment"
    echo "2. Update .env files with your configuration"
    echo "3. Deploy contracts to Story testnet"
    echo "4. Update contract addresses in environment files"
    echo ""
    
    read -p "Would you like to start the development servers now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_dev_servers
    else
        print_status "You can start the servers later with:"
        print_status "  Backend: cd backend && npm run dev"
        print_status "  Frontend: cd frontend && npm run dev"
    fi
}

# Run main function
main
