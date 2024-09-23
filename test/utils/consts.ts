import { ALPH_TOKEN_ID, NodeProvider, ZERO_ADDRESS } from '@alephium/web3'

export const StreamFactoryErrors = {
  NotAuthorized: 0, // Caller is not authorized
  NotAvailable: 1, // Stream is not available for withdrawal
  NotCancelable: 2, // Stream is not cancelable
  NotTransferable: 3, // Stream is not transferable
  InvalidRecipientGroup: 4, // Provided recipient's address group is invalid
  InvalidAmount: 5, // Provided amount is invalid
  InvalidStreamPeriod: 6, // Stream period is invalid
  InvalidUnlockInterval: 7, // Unlock interval is invalid
  InvalidUnlockPercentage: 8, // Unlock percentage is invalid
  InvalidUnlockStepsLength: 9, // Unlock steps length is invalid
  InvalidUnlockStepsOrder: 10, // Unlock steps order is invalid
  InvalidWithdrawAmount: 11, // Withdraw amount is invalid
  VaultAlreadyExists: 12, // Vault already exists
  VaultDoesNotExist: 13, // Vault does not exists
}

export const defaultStreamFields = {
  factoryContractId: '',
  creator: ZERO_ADDRESS,
  recipient: ZERO_ADDRESS,
  tokenId: '',
  amount: 0n,
  config: {
    kind: 0n,

    isCancelable: false,
    isTransferable: false,

    startTimestamp: 0n,
    endTimestamp: 0n,

    unlockInterval: 0n,
    unlockPercentage: 0n,

    unlockSteps: '',
  },
  withdrawnAmount: 0n,
}

export const defaultVaultFields = {
  factoryContractId: ZERO_ADDRESS,
  tokenId: ALPH_TOKEN_ID,
}

export const defaultStreamFactoryFields = {
  streamTemplateId: '',
  streamCounter: 1n,
}

export const ONE_DAY = 24 * 60 * 60 * 1_000

export const defaultNodeProvider = new NodeProvider(process.env.NODE_URL || 'http://127.0.0.1:22973')
