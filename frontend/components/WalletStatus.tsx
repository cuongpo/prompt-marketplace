import { useAccount, useNetwork, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { testRPCConnection, getBalance } from '../lib/rpc-test'

export default function WalletStatus() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: balance, isError: balanceError, isLoading: balanceLoading } = useBalance({
    address: address,
    enabled: !!address && isConnected,
    watch: true,
  })
  const [mounted, setMounted] = useState(false)
  const [rpcTest, setRpcTest] = useState<any>(null)
  const [manualBalance, setManualBalance] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Test RPC connection
  useEffect(() => {
    if (mounted) {
      testRPCConnection('https://aeneid.storyrpc.io').then(setRpcTest)
    }
  }, [mounted])

  // Get balance manually via RPC
  useEffect(() => {
    if (mounted && address) {
      getBalance('https://aeneid.storyrpc.io', address).then(setManualBalance)
    }
  }, [mounted, address])

  const refreshBalance = () => {
    if (address) {
      setManualBalance(null)
      getBalance('https://aeneid.storyrpc.io', address).then(setManualBalance)
    }
  }

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Wallet not connected.</strong> Please connect your wallet to interact with the blockchain.
        </p>
      </div>
    )
  }

  const isCorrectNetwork = chain?.id === 1315 // Story Aeneid Testnet

  return (
    <div className={`p-4 border rounded-lg ${
      isCorrectNetwork 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Wallet:</span>
          <span className="text-sm text-gray-600">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Network:</span>
          <span className={`text-sm ${
            isCorrectNetwork ? 'text-green-600' : 'text-red-600'
          }`}>
            {chain?.name || 'Unknown'} ({chain?.id})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Balance:</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {balanceLoading ? (
                'Loading...'
              ) : balanceError ? (
                <span className="text-red-600">Error loading balance</span>
              ) : balance ? (
                `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
              ) : manualBalance?.success ? (
                `${manualBalance.balanceFormatted} IP`
              ) : (
                '0.0000 IP'
              )}
            </span>
            <button
              onClick={refreshBalance}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {!isCorrectNetwork && (
          <div className="mt-3 p-2 bg-red-100 rounded">
            <p className="text-xs text-red-700">
              ⚠️ Please switch to Story Aeneid Testnet (Chain ID: 1315) to use this dApp.
            </p>
          </div>
        )}

        {isCorrectNetwork && manualBalance?.success && parseFloat(manualBalance.balanceFormatted) > 0 && (
          <div className="mt-3 p-2 bg-green-100 rounded">
            <p className="text-xs text-green-700">
              ✅ Wallet funded with {manualBalance.balanceFormatted} IP tokens - ready to create prompts!
            </p>
          </div>
        )}

        {/* Debug Information */}
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <details>
            <summary className="cursor-pointer text-gray-600">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>
                <strong>RPC Test:</strong> {rpcTest ? (
                  rpcTest.success ? (
                    <span className="text-green-600">
                      ✅ Connected (Chain: {rpcTest.chainId}, Block: {rpcTest.blockNumber})
                    </span>
                  ) : (
                    <span className="text-red-600">❌ {rpcTest.error}</span>
                  )
                ) : (
                  'Testing...'
                )}
              </div>
              <div>
                <strong>Manual Balance:</strong> {manualBalance ? (
                  manualBalance.success ? (
                    <span className="text-green-600">
                      {manualBalance.balanceFormatted} IP
                    </span>
                  ) : (
                    <span className="text-red-600">❌ {manualBalance.error}</span>
                  )
                ) : (
                  'Loading...'
                )}
              </div>
              <div>
                <strong>Wagmi Balance:</strong> {balanceLoading ? (
                  'Loading...'
                ) : balanceError ? (
                  <span className="text-red-600">Error</span>
                ) : balance ? (
                  <span className="text-green-600">{balance.formatted} {balance.symbol}</span>
                ) : (
                  'No data'
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
