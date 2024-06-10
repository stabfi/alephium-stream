import { Stream } from '../artifacts/ts'
import { defaultStreamFields, setupNodeProvider } from './utils'

setupNodeProvider()

describe('[UNIT] Stream', () => {
  describe('getLockedAmount()', () => {
    it('should return the correct value', async () => {
      const call = await Stream.tests.getLockedAmount({
        initialFields: {
          ...defaultStreamFields,
          amount: 100n,
          withdrawnAmount: 50n,
        },
      })

      expect(call.returns).toEqual(100n - 50n)
    })
  })

  describe('getAvailableAmount()', () => {
    it('should return zero if the stream has not started yet', async () => {
      const timestamp = Date.now()

      const call = await Stream.tests.getAvailableAmount({
        initialFields: {
          ...defaultStreamFields,
          config: {
            ...defaultStreamFields.config,
            startTimestamp: BigInt(timestamp),
          },
        },
        blockTimeStamp: timestamp - 1,
      })

      expect(call.returns).toEqual(0n)
    })

    describe('Linear unlock model', () => {
      it('should correctly calculate the available amount in the middle of the period', async () => {
        const timestamp = Date.now()

        const startTimestamp = timestamp - 100
        const endTimestamp = timestamp + 100

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              isLinear: true,
              startTimestamp: BigInt(startTimestamp),
              endTimestamp: BigInt(endTimestamp),
            },
          },
          blockTimeStamp: timestamp,
        })

        expect(call.returns).toEqual(500_000n)
      })

      it('should correctly calculate the available amount after the end of the period', async () => {
        const timestamp = Date.now()

        const startTimestamp = timestamp - 300
        const endTimestamp = timestamp - 100

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              isLinear: true,
              startTimestamp: BigInt(startTimestamp),
              endTimestamp: BigInt(endTimestamp),
            },
          },
          blockTimeStamp: timestamp,
        })

        expect(call.returns).toEqual(1_000_000n)
      })
    })

    describe('Custom unlock model', () => {
      it('should correctly calculate the available amount in the middle of the period', async () => {
        const timestamp = Date.now()

        const startTimestamp = timestamp - 500

        const unlockInterval = 100
        const unlockPercentage = 10

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              startTimestamp: BigInt(startTimestamp),
              unlockInterval: BigInt(unlockInterval),
              unlockPercentage: BigInt(unlockPercentage),
            },
          },
          blockTimeStamp: timestamp,
        })

        expect(call.returns).toEqual(500_000n)
      })

      it('should correctly calculate the available amount after the end of the period', async () => {
        const timestamp = Date.now()

        const startTimestamp = timestamp - 1_500

        const unlockInterval = 100
        const unlockPercentage = 10

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              startTimestamp: BigInt(startTimestamp),
              unlockInterval: BigInt(unlockInterval),
              unlockPercentage: BigInt(unlockPercentage),
            },
          },
          blockTimeStamp: timestamp,
        })

        expect(call.returns).toEqual(1_000_000n)
      })
    })
  })
})
