import { ALPH_TOKEN_ID, ContractInstance, DUST_AMOUNT, groupOfAddress, MINIMAL_CONTRACT_DEPOSIT } from '@alephium/web3'
import { StreamFactoryInstance, StreamFactoryTypes } from '../../artifacts/ts'
import { setAccount, wallet } from './helpers'

type WrapperExpectedResult = { success: true } | { success: false; errorCode: number }

export const Success = (): WrapperExpectedResult => ({ success: true })
export const Fail = (errorCode: number): WrapperExpectedResult => ({ success: false, errorCode })

const wrapperFunction = async <I extends ContractInstance, P>({
  instance,
  params,
  method,
  account,
  contractDeposit,
  tokenId,
  tokenAmount,
  expected,
}: {
  instance: I
  params: P
  method: string
  account?: string
  contractDeposit?: boolean
  tokenId?: string
  tokenAmount?: bigint
  expected: WrapperExpectedResult
}): Promise<any> => {
  try {
    await setAccount(account || 'main', groupOfAddress(instance.address))

    const result = await (instance as any).transact[method]({
      signer: wallet,
      args: params,
      attoAlphAmount: DUST_AMOUNT + (contractDeposit ? MINIMAL_CONTRACT_DEPOSIT : 0n),
      tokens: tokenAmount
        ? [
            {
              id: tokenId || ALPH_TOKEN_ID,
              amount: tokenAmount,
            },
          ]
        : undefined,
    })

    if (!expected.success) {
      throw new Error('Unexpected success')
    }

    return result
  } catch (error) {
    if (!expected.success) {
      expect((error as Error).message).toContain(`Error Code: ${expected.errorCode}`)

      return
    }

    throw error
  }
}

export const StreamFactoryWrapper = <T extends keyof StreamFactoryInstance['transact']>(opts: {
  instance: StreamFactoryInstance
  method: T
  params: StreamFactoryTypes.SignExecuteMethodParams<T>['args']
  account?: string
  contractDeposit?: boolean
  tokenId?: string
  tokenAmount?: bigint
  expected: WrapperExpectedResult
}): StreamFactoryTypes.SignExecuteMethodResult<T> => wrapperFunction(opts) as never as StreamFactoryTypes.SignExecuteMethodResult<T>
