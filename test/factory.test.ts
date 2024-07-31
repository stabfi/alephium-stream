import { ALPH_TOKEN_ID, ONE_ALPH, ZERO_ADDRESS } from '@alephium/web3'
import { Stream, StreamFactory } from '../artifacts/ts'
import { defaultStreamFields, defaultStreamFactoryFields, setupNodeProvider } from './utils'

setupNodeProvider()

const TEST_ADDRESS = '1kTAcEj2mBcNb1WnXWc42SGtoAn6NF5Fa5xGcjqKJ5uu'

describe('[UNIT] Factory', () => {
  describe('createStream()', () => {
    it('should revert if amount is zero', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)

        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: 0n,
            recipient: TEST_ADDRESS,
            config: defaultStreamFields.config,
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 5')
      }
    })

    it('should revert if linear unlock period is invalid', async () => {
      try {
        const timestamp = Date.now()

        const streamState = Stream.stateForTest(defaultStreamFields)
        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              isLinear: true,
              startTimestamp: BigInt(timestamp),
              endTimestamp: BigInt(timestamp - 100),
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 6')
      }
    })

    it('should revert if interval unlock interval is invalid', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 1n,
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 7')
      }
    })

    it('should revert if interval unlock percentage is zero', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 1n,
              unlockInterval: 1n,
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 8')
      }
    })

    it('should revert if interval unlock percentage is zero', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 1n,
              unlockInterval: 1n,
              unlockPercentage: 0n,
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 8')
      }
    })

    it('should revert if interval unlock percentage is invalid', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 1n,
              unlockInterval: 1n,
              unlockPercentage: 30n,
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 8')
      }
    })

    it('should revert if custom unlock steps data is empty', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps: '',
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 9')
      }
    })

    it('should revert if custom unlock steps data is invalid', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps: 0n.toString(16).padStart(64, '0'),
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 9')
      }
    })

    it('should revert if custom unlock steps data is invalid (timestamp = 0)', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        let unlockSteps = ''
        unlockSteps += 0n.toString(16).padStart(64, '0')
        unlockSteps += 0n.toString(16).padStart(64, '0')

        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps,
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 10')
      }
    })

    it('should revert if custom unlock steps data is invalid (amount = 0)', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        let unlockSteps = ''
        unlockSteps += 1n.toString(16).padStart(64, '0')
        unlockSteps += 0n.toString(16).padStart(64, '0')

        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps,
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 5')
      }
    })

    it('should revert if custom unlock steps data is invalid (timestamp less than previous)', async () => {
      try {
        const streamState = Stream.stateForTest(defaultStreamFields)
        let unlockSteps = ''
        unlockSteps += 50n.toString(16).padStart(64, '0')
        unlockSteps += 100n.toString(16).padStart(64, '0')

        unlockSteps += 49n.toString(16).padStart(64, '0')
        unlockSteps += 100n.toString(16).padStart(64, '0')

        await StreamFactory.tests.createStream({
          initialFields: {
            ...defaultStreamFactoryFields,
            streamTemplateId: streamState.contractId,
          },
          testArgs: {
            caller: TEST_ADDRESS,
            tokenId: ALPH_TOKEN_ID,
            amount: ONE_ALPH,
            recipient: TEST_ADDRESS,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps,
            },
          },
          inputAssets: [
            {
              address: TEST_ADDRESS,
              asset: {
                alphAmount: ONE_ALPH * 2n,
              },
            },
          ],
        })

        throw new Error('Invalid response')
      } catch (err) {
        expect((err as Error).message).toContain('Error Code: 10')
      }
    })
  })
})
