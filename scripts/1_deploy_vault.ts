import { ZERO_ADDRESS, ALPH_TOKEN_ID } from '@alephium/web3'
import { Deployer, DeployFunction } from '@alephium/cli'

import { Settings } from '../alephium.config'
import { Vault } from '../artifacts/ts'

const deployVault: DeployFunction<Settings> = async (deployer: Deployer): Promise<void> => {
  const deployment = await deployer.deployContract(Vault, {
    initialFields: {
      factoryContractId: ZERO_ADDRESS,
      tokenId: ALPH_TOKEN_ID,
    },
  })

  console.log('Vault contract id: ' + deployment.contractInstance.contractId)
  console.log('Vault contract address: ' + deployment.contractInstance.address)
}

export default deployVault
