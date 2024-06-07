import { Deployer, DeployFunction } from '@alephium/cli'

import { Settings } from '../alephium.config'
import { StreamFactory } from '../artifacts/ts'

const deployStreamFactory: DeployFunction<Settings> = async (
  deployer: Deployer,
): Promise<void> => {
  const streamDeployment = deployer.getDeployContractResult('Stream')

  const deployment = await deployer.deployContract(StreamFactory, {
    initialFields: {
      streamTemplateId: streamDeployment.contractInstance.contractId,
      streamCounter: 0,
    },
  })

  console.log(
    'StreamFactory contract id: ' + deployment.contractInstance.contractId,
  )
  console.log(
    'StreamFactory contract address: ' + deployment.contractInstance.address,
  )
}

export default deployStreamFactory
