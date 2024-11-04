const { TBTC } = require("@keep-network/tbtc-v2.ts")
const base58check = require('base58check')
const ethers = require("ethers")

const bitcoinAddress = process.env.BITCOIN_ADDRESS

const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com")
// const provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com")

// Create an Ethers signer. Pass the private key and the above provider.
const signer = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider)

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.mint = async () => {

    // If you want to make transactions as well, you have to pass the signer.
    const sdk = await TBTC.initializeSepolia(signer)
    const deposit = await sdk.deposits.initiateDeposit(bitcoinAddress)

    // Take the Bitcoin deposit address. BTC must be sent here.
    const bitcoinDepositAddress = await deposit.getBitcoinAddress()
    console.log(bitcoinDepositAddress)
    
    let length = 0
    let fundingUTXOs;
    while(length == 0) {
        fundingUTXOs = await deposit.detectFunding()
        length = fundingUTXOs.length
        await sleep(120000)
    }

    console.log(fundingUTXOs)

    const txHash = await deposit.initiateMinting(fundingUTXOs[0])

    console.log(txHash)

}

exports.unMint = async () => {

    const amount = ethers.BigNumber.from(4 * 1e1)

    const {
        targetChainTxHash,
        walletPublicKey
    } = await sdk.redemptions.requestRedemption(bitcoinAddress, amount)

    console.log(targetChainTxHash)
    console.log(walletPublicKey)
}