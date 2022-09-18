import fs from 'fs'
import { WarpFactory } from 'warp-contracts'

async function deploy() {
  const warp = WarpFactory.forMainnet();
  const wallet = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
  const state = fs.readFileSync('contract/state.json', 'utf-8')
  const contractSource = fs.readFileSync('contract/contract.js', 'utf-8')
  const { contractTxId } = await warp.createContract.deploy({
    wallet,
    initState: state,
    src: contractSource
  })

  fs.writeFileSync('../contractID.js', `export const contractID = "${contractTxId}"`)

  const contract = warp.contract(contractTxId).connect(wallet)

  await contract.writeInteraction({
    function: 'click'
  })
  const { cachedValue } = await contract.readState()

  console.log('Contract state: ', cachedValue)
  console.log('contractTxId: ', contractTxId)
}
deploy()
