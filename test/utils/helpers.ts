import { addressFromContractId, ALPH_TOKEN_ID, DUST_AMOUNT, ONE_ALPH, subContractId, web3 } from '@alephium/web3'
import { HDWallet, type HDWalletAccount } from '@alephium/web3-wallet'
import { randomContractAddress } from '@alephium/web3-test'
import { type Deployments } from '@alephium/cli'

import { defaultNodeProvider, defaultStreamFields, ONE_DAY } from './consts'
import { Stream, StreamFactory, type StreamFactoryInstance, StreamFactoryTypes, type StreamInstance, Vault, type VaultInstance } from '../../artifacts/ts'
import { StreamFactoryWrapper, Success } from './wrappers'

export const setupNodeProvider = () => web3.setCurrentNodeProvider(defaultNodeProvider)
export const wallet = new HDWallet({
  mnemonic:
    'vault alarm sad mass witness property virus style good flower rice alpha viable evidence run glare pretty scout evil judge enroll refuse another lava',
  nodeProvider: defaultNodeProvider,
})

const ACCOUNTS_CACHE = new Map<string, HDWalletAccount>()
export const setAccount = async (name: string, group: number): Promise<HDWalletAccount> => {
  const accountKey = `${name}-${group}`
  if (ACCOUNTS_CACHE.has(accountKey)) {
    const account = ACCOUNTS_CACHE.get(accountKey)!
    wallet.setSelectedAccount(account.address)

    return account
  }

  const account = wallet.deriveAndAddNewAccount(group)
  const { balance } = await defaultNodeProvider.addresses.getAddressesAddressBalance(account.address)
  if (balance === '0') {
    const main = ACCOUNTS_CACHE.get(`main-${group}`)!
    await wallet.signAndSubmitTransferTx({
      signerAddress: main?.address,
      destinations: [
        {
          address: account.address,
          attoAlphAmount: DUST_AMOUNT + ONE_ALPH * 1_000n,
        },
      ],
    })
  }

  wallet.setSelectedAccount(account.address)

  ACCOUNTS_CACHE.set(accountKey, account)

  return account
}

type ContractType = 'Vault' | 'Stream' | 'StreamFactory'
type ReturnContract<T> = T extends 'Vault' ? VaultInstance : T extends 'Stream' ? StreamInstance : T extends 'StreamFactory' ? StreamFactoryInstance : never

export const getDevnetContract = <T extends ContractType>(deployments: Deployments, name: T): ReturnContract<T> => {
  const metadata = deployments.getDeployedContractResult(0, name)

  if (name === 'Vault') {
    return Vault.at(metadata!.contractInstance.address) as ReturnContract<T>
  } else if (name === 'Stream') {
    return Stream.at(metadata!.contractInstance.address) as ReturnContract<T>
  } else {
    return StreamFactory.at(metadata!.contractInstance.address) as ReturnContract<T>
  }
}

export const getStreamId = async (txId: string): Promise<bigint> => {
  const { events } = await web3.getCurrentNodeProvider().events.getEventsTxIdTxid(txId)

  return BigInt(events.find(e => e.eventIndex === 0)!.fields[0].value as any as bigint)
}

export const createStream = async (
  deployments: Deployments,
  tokenId: string,
  paramsOverride: Partial<StreamFactoryTypes.SignExecuteMethodTable['createStream']['params']['args']> = {},
) => {
  const instance = getDevnetContract(deployments, 'StreamFactory')
  const account = await setAccount('main', instance.groupIndex)

  const streamTx = await StreamFactoryWrapper({
    instance,
    method: 'createStream',
    contractDeposit: true,
    params: {
      caller: account.address,
      tokenId,
      amount: ONE_ALPH,
      recipient: randomContractAddress(instance.groupIndex),
      config: {
        ...defaultStreamFields.config,
        startTimestamp: BigInt(Date.now()),
        endTimestamp: BigInt(Date.now() + ONE_DAY),
      },
      ...paramsOverride,
    },
    tokenId,
    tokenAmount: ONE_ALPH,
    expected: Success(),
  })

  return await getStreamId(streamTx.txId)
}

export const getStreamInstance = (deployments: Deployments, streamId: bigint) => {
  const instance = getDevnetContract(deployments, 'StreamFactory')

  return Stream.at(addressFromContractId(subContractId(instance.contractId, streamId.toString(16), instance.groupIndex)))
}

export const getTokenBalance = async (address: string, tokenId: string) => {
  const balance = await defaultNodeProvider.addresses.getAddressesAddressBalance(address)
  const tokenBalance = balance.tokenBalances?.find(b => b.id === tokenId) || []

  return BigInt((tokenBalance as any)?.amount || 0)
}
