import { NodeProvider, ZERO_ADDRESS, web3 } from '@alephium/web3'

export const defaultStreamFields = {
  factoryContractId: '',
  creator: ZERO_ADDRESS,
  recipient: ZERO_ADDRESS,
  tokenId: '',
  amount: 0n,
  config: {
    isLinear: false,
    isCancelable: false,

    startTimestamp: 0n,
    endTimestamp: 0n,

    unlockInterval: 0n,
    unlockPercentage: 0n,
  },
  withdrawnAmount: 0n,
}

export const ONE_DAY = 24 * 60 * 60 * 1_000

export const defaultNodeProvider = new NodeProvider(process.env.NODE_URL || '')
export const setupNodeProvider = () => web3.setCurrentNodeProvider(defaultNodeProvider)
