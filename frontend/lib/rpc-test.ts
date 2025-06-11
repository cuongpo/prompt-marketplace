// RPC testing utilities

export async function testRPCConnection(rpcUrl: string): Promise<{
  success: boolean
  chainId?: number
  blockNumber?: number
  error?: string
}> {
  try {
    // Test basic RPC connection
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message)
    }

    const chainId = parseInt(data.result, 16)

    // Get latest block number
    const blockResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 2,
      }),
    })

    const blockData = await blockResponse.json()
    const blockNumber = parseInt(blockData.result, 16)

    return {
      success: true,
      chainId,
      blockNumber,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getBalance(rpcUrl: string, address: string): Promise<{
  success: boolean
  balance?: string
  balanceFormatted?: string
  error?: string
}> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 3,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message)
    }

    const balanceWei = BigInt(data.result)
    const balanceEth = Number(balanceWei) / 1e18

    return {
      success: true,
      balance: data.result,
      balanceFormatted: balanceEth.toFixed(6),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
