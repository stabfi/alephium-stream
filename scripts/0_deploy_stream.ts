import { ZERO_ADDRESS, ALPH_TOKEN_ID } from '@alephium/web3'
import { Deployer, DeployFunction } from '@alephium/cli'

import { Settings } from '../alephium.config'
import { Stream } from '../artifacts/ts'

const deployStream: DeployFunction<Settings> = async (deployer: Deployer): Promise<void> => {
  const deployment = await deployer.deployContract(Stream, {
    initialFields: {
      factoryContractId: ZERO_ADDRESS,
      creator: ZERO_ADDRESS,
      recipient: ZERO_ADDRESS,
      tokenId: ALPH_TOKEN_ID,
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
    },
  })

  console.log('Stream contract id: ' + deployment.contractInstance.contractId)
  console.log('Stream contract address: ' + deployment.contractInstance.address)
}

export default deployStream
