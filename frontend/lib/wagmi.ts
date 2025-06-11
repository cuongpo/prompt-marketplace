import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

// Story Protocol chain configuration
const storyTestnet = {
  id: 1315,
  name: 'Story Aeneid Testnet',
  network: 'story-aeneid-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    public: { http: ['https://aeneid.storyrpc.io'] },
    default: { http: ['https://aeneid.storyrpc.io'] },
  },
  blockExplorers: {
    default: { name: 'StoryScan', url: 'https://aeneid.storyscan.xyz' },
  },
  testnet: true,
}

const storyMainnet = {
  id: 1516,
  name: 'Story Protocol',
  network: 'story',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    public: { http: ['https://story-network.rpc.caldera.xyz/http'] },
    default: { http: ['https://story-network.rpc.caldera.xyz/http'] },
  },
  blockExplorers: {
    default: { name: 'StoryScan', url: 'https://storyscan.xyz' },
  },
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [storyTestnet, storyMainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'AI Prompt Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }
