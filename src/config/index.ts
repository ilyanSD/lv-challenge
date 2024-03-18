import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const projectId = process.env.WC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'LandVault Challenge',
  description: 'This is LandVault\'s Challengue',
  url: 'http://localhost:3000', //
  icons: []
}

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [mainnet],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})