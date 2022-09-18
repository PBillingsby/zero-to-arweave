import fs from 'fs'
import { WarpFactory } from 'warp-contracts'

async function deploy() {
  // Creating a mainnet Warp instance
  const warp = WarpFactory.forMainnet();
  // Importing what is needed for the initial deployment
  const wallet = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
  const contractSource = fs.readFileSync('contract/contract.js', 'utf-8')

  // Setting contract initState & Deploying first contract
  const { contractTxId } = await warp.createContract.deploy({
    wallet,
    initState: JSON.stringify({
      "clicks": 0
    }),
    src: contractSource
  })

  const contract = warp.contract(contractTxId).connect(wallet)
  // Interacting with smart contract by calling the click function
  await contract.writeInteraction({
    function: 'click'
  })
  // Reading and abstracting contract state
  const { cachedValue } = await contract.readState()

  console.log('Contract state: ', cachedValue)
  console.log('contractTxId: ', contractTxId)
}
deploy()
