import { type Deployments, deployToDevnet } from '@alephium/cli'
import { ALPH_TOKEN_ID, DUST_AMOUNT, groupOfAddress, ONE_ALPH } from '@alephium/web3'
import { mintToken, randomContractAddress, randomContractId } from '@alephium/web3-test'

import { createStream, getDevnetContract, getStreamInstance, getTokenBalance, setAccount, wallet } from './utils/helpers'
import { Fail, StreamFactoryWrapper, Success } from './utils/wrappers'
import { defaultNodeProvider, defaultStreamFields, ONE_DAY, StreamFactoryErrors } from './utils/consts'
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { TransferStream } from '../artifacts/ts'

let deployments: Deployments
beforeAll(async () => {
  deployments = await deployToDevnet(true)

  await setAccount('main', 0)
})

describe('StreamFactory e2e tests', () => {
  describe('createVault()', () => {
    it('should create a Vault', async () => {
      const instance = getDevnetContract(deployments, 'StreamFactory')

      await StreamFactoryWrapper({
        instance,
        method: 'createVault',
        params: {
          tokenId: randomContractId(groupOfAddress(instance.address)),
        },
        contractDeposit: true,
        expected: Success(),
      })
    })

    it('should not create a duplicate Vault', async () => {
      const instance = getDevnetContract(deployments, 'StreamFactory')
      const tokenId = randomContractId(0)

      await StreamFactoryWrapper({
        instance,
        method: 'createVault',
        params: { tokenId },
        contractDeposit: true,
        expected: Success(),
      })

      await StreamFactoryWrapper({
        instance,
        method: 'createVault',
        params: { tokenId },
        contractDeposit: true,
        expected: Fail(StreamFactoryErrors.VaultAlreadyExists),
      })
    })
  })

  describe('createStream()', () => {
    it('should fail if amount is zero', async () => {
      const instance = getDevnetContract(deployments, 'StreamFactory')
      const account = await setAccount('main', instance.groupIndex)

      await StreamFactoryWrapper({
        instance,
        method: 'createStream',
        account: 'main',
        params: {
          caller: account.address,
          tokenId: ALPH_TOKEN_ID,
          amount: 0n,
          recipient: randomContractAddress(instance.groupIndex),
          config: defaultStreamFields.config,
        },
        expected: Fail(StreamFactoryErrors.InvalidAmount),
      })
    })

    it("should fail if vault doesn't exists", async () => {
      const instance = getDevnetContract(deployments, 'StreamFactory')
      const account = await setAccount('main', instance.groupIndex)

      await StreamFactoryWrapper({
        instance,
        method: 'createStream',
        account: 'main',
        params: {
          caller: account.address,
          tokenId: randomContractId(instance.groupIndex),
          amount: 1n,
          recipient: randomContractAddress(instance.groupIndex),
          config: defaultStreamFields.config,
        },
        expected: Fail(StreamFactoryErrors.VaultDoesNotExist),
      })
    })

    describe('[isolated token scope]', () => {
      let tokenId: string
      beforeAll(async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)
        const token = await mintToken(account.address, ONE_ALPH * 1_000_000n)

        tokenId = token.contractId

        await StreamFactoryWrapper({
          instance,
          method: 'createVault',
          contractDeposit: true,
          params: { tokenId },
          expected: Success(),
        })
      })

      it('should fail if linear unlock period is invalid', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        const timestamp = Date.now()

        await StreamFactoryWrapper({
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
              startTimestamp: BigInt(timestamp),
              endTimestamp: BigInt(timestamp - 100),
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidStreamPeriod),
        })
      })

      it('should fail if interval unlock interval is zero', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        await StreamFactoryWrapper({
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
              kind: 1n,
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidUnlockInterval),
        })
      })

      it('should fail if interval unlock percentage is zero', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        await StreamFactoryWrapper({
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
              kind: 1n,
              unlockInterval: 1n,
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidUnlockPercentage),
        })
      })

      it('should fail if interval unlock percentage is invalid', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        await StreamFactoryWrapper({
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
              kind: 1n,
              unlockInterval: 1n,
              unlockPercentage: 30n,
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidUnlockPercentage),
        })
      })

      it('should fail if custom unlock steps data is empty', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        await StreamFactoryWrapper({
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
              kind: 2n,
              unlockSteps: '',
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidUnlockStepsLength),
        })
      })

      it('should fail if custom unlock steps data is invalid', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        await StreamFactoryWrapper({
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
              kind: 2n,
              unlockSteps: 0n.toString(16).padStart(64, '0'),
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidUnlockStepsLength),
        })
      })

      it('should fail if custom unlock steps data is invalid (timestamp = 0)', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        let unlockSteps = ''
        unlockSteps += 0n.toString(16).padStart(64, '0')
        unlockSteps += 0n.toString(16).padStart(64, '0')

        await StreamFactoryWrapper({
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
              kind: 2n,
              unlockSteps,
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidUnlockStepsOrder),
        })
      })

      it('should fail if custom unlock steps data is invalid (amount = 0)', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        let unlockSteps = ''
        unlockSteps += 1n.toString(16).padStart(64, '0')
        unlockSteps += 0n.toString(16).padStart(64, '0')

        await StreamFactoryWrapper({
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
              kind: 2n,
              unlockSteps,
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidAmount),
        })
      })

      // it('should fail if custom unlock steps data is invalid (passed amount != stream amount)', async () => {
      //   const instance = getDevnetContract(deployments, 'StreamFactory')
      //   const account = await setAccount('main', instance.groupIndex)

      //   let unlockSteps = ''
      //   unlockSteps += 1n.toString(16).padStart(64, '0')
      //   unlockSteps += 50n.toString(16).padStart(64, '0')

      //   await StreamFactoryWrapper({
      //     instance,
      //     method: 'createStream',
      //     contractDeposit: true,
      //     params: {
      //       caller: account.address,
      //       tokenId,
      //       amount: ONE_ALPH,
      //       recipient: randomContractAddress(instance.groupIndex),
      //       config: {
      //         ...defaultStreamFields.config,
      //         kind: 2n,
      //         unlockSteps,
      //       },
      //     },
      //     tokenId,
      //     tokenAmount: ONE_ALPH,
      //     expected: Fail(StreamFactoryErrors.InvalidAmount),
      //   })
      // })

      it('should fail if custom unlock steps data is invalid (timestamp less than previous)', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)

        let unlockSteps = ''
        unlockSteps += 50n.toString(16).padStart(64, '0')
        unlockSteps += 100n.toString(16).padStart(64, '0')

        unlockSteps += 49n.toString(16).padStart(64, '0')
        unlockSteps += 100n.toString(16).padStart(64, '0')

        await StreamFactoryWrapper({
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
              kind: 2n,
              unlockSteps,
            },
          },
          tokenId,
          tokenAmount: ONE_ALPH,
          expected: Fail(StreamFactoryErrors.InvalidUnlockStepsOrder),
        })
      })
    })
  })

  describe('withdrawStream()', () => {
    describe('[isolated token scope]', () => {
      let tokenId: string
      beforeAll(async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)
        const token = await mintToken(account.address, ONE_ALPH * 1_000_000n)

        tokenId = token.contractId

        await StreamFactoryWrapper({
          instance,
          method: 'createVault',
          contractDeposit: true,
          params: { tokenId },
          expected: Success(),
        })
      })

      it('should fail if caller is not authorized', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const streamId = await createStream(deployments, tokenId)

        await StreamFactoryWrapper({
          instance,
          account: 'unknown',
          method: 'withdrawStream',
          params: { streamId, amount: 0n },
          expected: Fail(StreamFactoryErrors.NotAuthorized),
        })
      })

      it('should fail if there are no amount to withdraw', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const recipient = await setAccount('recipient', instance.groupIndex)
        const streamId = await createStream(deployments, tokenId, {
          recipient: recipient.address,
          config: {
            ...defaultStreamFields.config,
            startTimestamp: BigInt(Date.now() + ONE_DAY),
            endTimestamp: BigInt(Date.now() + ONE_DAY * 2),
          },
        })

        await StreamFactoryWrapper({
          instance,
          account: 'recipient',
          method: 'withdrawStream',
          params: { streamId, amount: 0n },
          expected: Fail(StreamFactoryErrors.NotAvailable),
        })
      })

      it('should fail if requested amount is higher than the available', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const recipient = await setAccount('recipient', instance.groupIndex)
        const streamId = await createStream(deployments, tokenId, {
          recipient: recipient.address,
          amount: ONE_ALPH,
          config: {
            ...defaultStreamFields.config,
            startTimestamp: BigInt(Date.now() - 1),
            endTimestamp: BigInt(Date.now() + ONE_DAY),
          },
        })

        await StreamFactoryWrapper({
          instance,
          account: 'recipient',
          method: 'withdrawStream',
          params: { streamId, amount: ONE_ALPH },
          expected: Fail(StreamFactoryErrors.InvalidWithdrawAmount),
        })
      })

      it('should withdraw correctly', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const recipient = await setAccount('recipient', instance.groupIndex)
        const streamId = await createStream(deployments, tokenId, {
          recipient: recipient.address,
          amount: ONE_ALPH,
          config: {
            ...defaultStreamFields.config,
            startTimestamp: BigInt(Date.now()),
            endTimestamp: BigInt(Date.now() + 60_000),
          },
        })

        const balanceBefore = await getTokenBalance(recipient.address, tokenId)

        const stream = getStreamInstance(deployments, streamId)

        await StreamFactoryWrapper({
          instance,
          account: 'recipient',
          method: 'withdrawStream',
          params: { streamId, amount: 0n },
          expected: Success(),
        })

        const balanceAfter = await getTokenBalance(recipient.address, tokenId)
        const stateAfter = await stream.fetchState()

        expect(balanceAfter - balanceBefore).toEqual(stateAfter.fields.withdrawnAmount)
      })
    })
  })

  describe('transferStream()', () => {
    describe('[isolated token scope]', () => {
      let tokenId: string
      beforeAll(async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)
        const token = await mintToken(account.address, ONE_ALPH * 1_000_000n)

        tokenId = token.contractId

        await StreamFactoryWrapper({
          instance,
          method: 'createVault',
          contractDeposit: true,
          params: { tokenId },
          expected: Success(),
        })
      })

      it('should fail if caller is not authorized', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const streamId = await createStream(deployments, tokenId)

        const newRecipient = randomContractAddress()

        await StreamFactoryWrapper({
          instance,
          account: 'unknown',
          method: 'transferStream',
          params: { streamId, newRecipient },
          expected: Fail(StreamFactoryErrors.NotAuthorized),
        })
      })

      it('should fail if stream is not transferable', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')

        const recipient = await setAccount('recipient', instance.groupIndex)
        const newRecipient = randomContractAddress()

        const streamId = await createStream(deployments, tokenId, {
          recipient: recipient.address,
        })

        await StreamFactoryWrapper({
          instance,
          account: 'recipient',
          method: 'transferStream',
          params: { streamId, newRecipient },
          expected: Fail(StreamFactoryErrors.NotTransferable),
        })
      })

      it('should transfer stream correctly', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')

        const recipient = await setAccount('recipient', instance.groupIndex)
        const newRecipient = randomContractAddress()

        const streamId = await createStream(deployments, tokenId, {
          recipient: recipient.address,
          config: {
            ...defaultStreamFields.config,
            startTimestamp: BigInt(Date.now()),
            endTimestamp: BigInt(Date.now() + ONE_DAY),
            isTransferable: true,
          },
        })

        const stream = getStreamInstance(deployments, streamId)
        const stateBefore = await stream.fetchState()

        await StreamFactoryWrapper({
          instance,
          account: 'recipient',
          method: 'transferStream',
          params: { streamId, newRecipient },
          expected: Success(),
        })

        const stateAfter = await stream.fetchState()

        expect(stateBefore.fields.recipient).toEqual(recipient.address)
        expect(stateAfter.fields.recipient).toEqual(newRecipient)
      })
    })
  })

  describe('cancelStream()', () => {
    describe('[isolated token scope]', () => {
      let tokenId: string
      beforeAll(async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const account = await setAccount('main', instance.groupIndex)
        const token = await mintToken(account.address, ONE_ALPH * 1_000_000n)

        tokenId = token.contractId

        await StreamFactoryWrapper({
          instance,
          method: 'createVault',
          contractDeposit: true,
          params: { tokenId },
          expected: Success(),
        })
      })

      it('should fail if caller is not authorized', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const streamId = await createStream(deployments, tokenId)

        await StreamFactoryWrapper({
          instance,
          account: 'unknown',
          method: 'cancelStream',
          params: { streamId },
          expected: Fail(StreamFactoryErrors.NotAuthorized),
        })
      })

      it('should fail if stream is not cancelable', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const streamId = await createStream(deployments, tokenId)

        await StreamFactoryWrapper({
          instance,
          method: 'cancelStream',
          params: { streamId },
          expected: Fail(StreamFactoryErrors.NotCancelable),
        })
      })

      it('should cancel stream and refund the locked tokens', async () => {
        const instance = getDevnetContract(deployments, 'StreamFactory')
        const main = await setAccount('main', instance.groupIndex)
        const recipient = await setAccount('recipient', instance.groupIndex)

        const streamId = await createStream(deployments, tokenId, {
          recipient: recipient.address,
          config: {
            ...defaultStreamFields.config,
            startTimestamp: BigInt(Date.now() - ONE_DAY * 2),
            endTimestamp: BigInt(Date.now() - ONE_DAY),
            isCancelable: true,
          },
        })

        const stream = getStreamInstance(deployments, streamId)
        const state = await stream.fetchState()

        const balanceBefore = await getTokenBalance(main.address, tokenId)

        await StreamFactoryWrapper({
          instance,
          method: 'cancelStream',
          params: { streamId },
          expected: Success(),
        })

        const balanceAfter = await getTokenBalance(main.address, tokenId)

        expect(balanceAfter - balanceBefore).toEqual(state.fields.amount)
      })
    })
  })
})
