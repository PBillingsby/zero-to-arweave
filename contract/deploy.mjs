import fs from 'fs'
import { WarpFactory } from 'warp-contracts'

export async function deploy() {
  // Creating local || mainnet Warp instance
  const warp = process.env.NODE_ENV === "development" ? WarpFactory.forLocal() : WarpFactory.forMainnet();
  // Creating test wallet || importing Arweave wallet from root
  let wallet
  if (process.env.NODE_ENV === "development") {
    const testWallet = await warp.testing.generateWallet()
    wallet = testWallet.jwk
  }
  else {
    wallet = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
  }
  // Importing the smart contract
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

  return { contractTxId, cachedValue }
}
deploy()
