import { ZERO_ADDRESS, ALPH_TOKEN_ID } from '@alephium/web3'
import { Deployer, DeployFunction } from '@alephium/cli'

import { Settings } from '../alephium.config'
import { Stream } from '../artifacts/ts'

const deployStream: DeployFunction<Settings> = async (
  deployer: Deployer,
): Promise<void> => {
  const deployment = await deployer.deployContract(Stream, {
    initialFields: {
      factoryContractId: ZERO_ADDRESS,
      sender: ZERO_ADDRESS,
      recipient: ZERO_ADDRESS,
      tokenId: ALPH_TOKEN_ID,
      amount: 0,
      config: {
        isLinear: false,
        isCancelable: false,
        startTimestamp: 0,
        endTimestamp: 0,
        unlockInterval: 0,
        unlockPercent: 0,
      },
      spent: 0,
    },
  })

  console.log('Stream contract id: ' + deployment.contractInstance.contractId)
  console.log('Stream contract address: ' + deployment.contractInstance.address)
}

export default deployStream
