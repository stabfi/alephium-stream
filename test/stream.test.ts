import { Stream } from '../artifacts/ts'
import { defaultStreamFields } from './utils/consts'
import { setupNodeProvider } from './utils/helpers'

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
              startTimestamp: BigInt(startTimestamp),
              endTimestamp: BigInt(endTimestamp),
            },
          },
          blockTimeStamp: timestamp,
        })

        expect(call.returns).toEqual(1_000_000n)
      })
    })

    describe('Interval unlock model', () => {
      const unlockInterval = 100
      const unlockPercentage = 10

      it('should correctly calculate the available amount in the middle of the period', async () => {
        const timestamp = Date.now()

        const startTimestamp = timestamp - 500

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              kind: 1n,
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

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              kind: 1n,
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

    describe('Custom unlock model', () => {
      const timestamp = Date.now()

      let unlockSteps = ''
      unlockSteps += BigInt(timestamp + 1_000)
        .toString(16)
        .padStart(64, '0')
      unlockSteps += 100n.toString(16).padStart(64, '0')

      unlockSteps += BigInt(timestamp + 2_000)
        .toString(16)
        .padStart(64, '0')
      unlockSteps += 200n.toString(16).padStart(64, '0')

      unlockSteps += BigInt(timestamp + 3_000)
        .toString(16)
        .padStart(64, '0')
      unlockSteps += 300n.toString(16).padStart(64, '0')

      it('should correctly calculate the available amount before the first unlock step', async () => {
        const blockTimeStamp = timestamp - 500

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps,
            },
          },
          blockTimeStamp,
        })

        expect(call.returns).toEqual(0n)
      })

      it('should correctly calculate the available amount after first unlock step', async () => {
        const blockTimeStamp = timestamp + 1_500

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps,
            },
          },
          blockTimeStamp,
        })

        expect(call.returns).toEqual(100n)
      })

      it('should correctly calculate the available amount after second unlock step', async () => {
        const blockTimeStamp = timestamp + 2_500

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps,
            },
          },
          blockTimeStamp,
        })

        expect(call.returns).toEqual(100n + 200n)
      })

      it('should correctly calculate the available amount after all unlock steps', async () => {
        const blockTimeStamp = timestamp + 60_000

        const call = await Stream.tests.getAvailableAmount({
          initialFields: {
            ...defaultStreamFields,
            amount: 1_000_000n,
            config: {
              ...defaultStreamFields.config,
              kind: 2n,
              unlockSteps,
            },
          },
          blockTimeStamp,
        })

        expect(call.returns).toEqual(100n + 200n + 300n)
      })
    })
  })
})
