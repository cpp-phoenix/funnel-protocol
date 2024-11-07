import { ethers } from "ethers";
import { simulateContract, writeContract } from '@wagmi/core'
import { useEffect, useState } from "react";
import { CHAINS_DATA, ARBITRUM_SEPOLIA, TOKENS_LIST } from "../constants/constants";
import { useAccount, useNetwork, useWalletClient, usePublicClient } from 'wagmi'
import { config } from "../App";
import { waitForTransactionReceipt } from '@wagmi/core'
import FunnelProtocolABI from "../abis/FunnelProtocol.json"
import DummyERC20ABI from "../abis/DummyERC20.json"

function Redeem () {
    const {address, isConnected, chain} = useAccount()

    const { data: signer } = useWalletClient();
    const fBTC = CHAINS_DATA[chain.id]["fpv"];

    const [inputAmount, setInputAmount] = useState(0)
    const [selectToken, setSelectToken] = useState("fBTC")
    const [tbtcEstimation, settbtcEstimation] = useState(0)
    const [tokenBalance, setTokenBalance] = useState(0)
    const [suffienceLiquidity, setSufficientLiquidity] = useState(false)
    const [allowanceLoading, setAllowanceLoading] = useState(false)
    const [mintLoading, setMintLoading] = useState(false)

    useEffect(() => {
        updateAmount(selectToken)
    }, [])

    const checkAllowance = async (amount) => {
        const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);
        const dummyERC20 = new ethers.Contract(fBTC, DummyERC20ABI, provider);
        const decimals = await dummyERC20.decimals()
        const allowance = await dummyERC20.allowance(address, CHAINS_DATA[chain.id]["fp"])
        const formattedAllowance = ethers.formatUnits(allowance, decimals)
        console.log(amount)
        console.log("Checking: ", formattedAllowance, amount)
        if(parseFloat(formattedAllowance) < parseFloat(amount)) {
            setSufficientLiquidity(false)
        } else {
            setSufficientLiquidity(true)
        }
    }

    const sendAllowanceTxn = async () => {
        if(inputAmount > 0){
            setAllowanceLoading(true)
            const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);

            const dummyERC20 = new ethers.Contract(fBTC, DummyERC20ABI, provider);
            const decimals = await dummyERC20.decimals()
            const formattedAmount = ethers.parseUnits(inputAmount.toString(), decimals)

            const { request } = await simulateContract(config, {
                abi:DummyERC20ABI,
                address: fBTC,
                functionName: 'approve',
                args: [
                    CHAINS_DATA[chain.id]["fp"],
                    formattedAmount
                ],
            })
            const _hash = await writeContract(config, request)

            const transactionReceipt = await waitForTransactionReceipt(config, {
                hash: _hash,
            })
            if(transactionReceipt["status"] === 'success') {
                setSufficientLiquidity(true)
            }
            setAllowanceLoading(false)
        }
    }

    const sendRedeemTxn = async () => {
        if(inputAmount > 0){
            const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);

            const dummyERC20 = new ethers.Contract(fBTC, DummyERC20ABI, provider);
            const decimals = await dummyERC20.decimals()
            const formattedAmount = ethers.parseUnits(inputAmount.toString(), decimals)

            const { request } = await simulateContract(config, {
                abi: FunnelProtocolABI,
                address: CHAINS_DATA[chain.id]["fp"],
                functionName: 'redeem',
                args: [
                    formattedAmount
                ],
            })
            const _hash = await writeContract(config, request)
            const transactionReceipt = await waitForTransactionReceipt(config, {
                hash: _hash,
            })

            if(transactionReceipt["status"] === 'success') {
                setSufficientLiquidity(true)
            }
        }
    }

    const updateAmount = async (token) => {
        const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);
        const dummyERC20 = new ethers.Contract(fBTC, DummyERC20ABI, provider);
        const balance = await dummyERC20.balanceOf(address)
        const decimals = await dummyERC20.decimals()
        const balanceWithDecimals = ethers.formatUnits(balance, decimals)

        setTokenBalance(balanceWithDecimals)
    }

    const estimatetBTC = async (_inputAmount) => {
        if(_inputAmount > 0) {
            setInputAmount(_inputAmount)
            checkAllowance(_inputAmount)
            const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);
            const dummyERC20 = new ethers.Contract(fBTC, DummyERC20ABI, provider);
            const decimals = await dummyERC20.decimals()
            const formattedBalance = ethers.parseUnits(_inputAmount.toString(), decimals)

            const funnelContract = new ethers.Contract(CHAINS_DATA[chain.id]["fp"], FunnelProtocolABI, provider);
            
            const tBTCContract = new ethers.Contract(CHAINS_DATA[chain.id]["tokens"]["tBTC"]["address"], DummyERC20ABI, provider);
            
            const tBTC = await funnelContract.convertToAssets(formattedBalance)
            
            const tBTCDecimals = await tBTCContract.decimals()
            const tBTCwithDecimals = ethers.formatUnits(tBTC, tBTCDecimals)
            settbtcEstimation(tBTCwithDecimals)
        } else {
            settbtcEstimation(0)
        }
    }

    return (
        <div className="flex flex-row items-center justify-center  w-full h-4/5">
            <div className="flex flex-col justify-between rounded-lg w-[500px] h-[270px] bg-[#304256] border border-black p-3">
                <div className="text-[#C7F284]">
                    <div className="flex w-full py-1 text-2xl text-white">Redeem</div>
                    <div className="static rounded border border-black flex justify-between w-full h-32 bg-[#121D28] flex items-center px-4">
                        <div className="space-y-1">
                            <div className="text-md">Amount</div>
                            <input onChange={(e) => {estimatetBTC(e.target.value)}} type="number" id="first_name" class="focus:ring-[#121D28] focus:border-[#121D28] dark:focus:ring-[#121D28]dark:focus:border-[#121D28] bg-[#121D28] border border-[#121D28] dark:border-[#121D28] text-gray-900 text-sm rounded-lg block w-20 border p-2.5 dark:bg-[#121D28] dark:placeholder-gray-500 dark:text-white" placeholder="0" required />
                        </div>
                        <button className="space-y-1 flex flex-col items-end relative inline-block text-left " id="menu-button" aria-expanded="true" aria-haspopup="true">
                            <div className="flex items-center space-x-2">
                                <div className="flex flex-col items-center text-xs space-y-1">
                                    <img className="w-10 h-10" src={CHAINS_DATA[ARBITRUM_SEPOLIA]["fBTC_logo"]} />
                                    <div>{selectToken}</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                Balance: {tokenBalance}
                            </div>
                        </button>
                    </div>
                </div>
                <div className="h-full">
                    <div className="flex flex-col justify-center items-end h-full text-[#C7F284]">
                        <div className="flex text-xs">
                            <div className="text-white">tBTC Estimate: </div>
                            <div className="pl-1 text-white">{tbtcEstimation}</div>
                        </div>
                    </div>
                </div>
                <div className="w-full font-semibold">
                    {
                        suffienceLiquidity ? 
                        <button onClick={() => sendRedeemTxn()} className="rounded-lg bg-[#C7F284] w-full h-12 flex items-center justify-center">Redeem</button> :
                        <button onClick={() => sendAllowanceTxn()} className="rounded-lg bg-[#C7F284] w-full h-12 flex items-center justify-center">
                            {
                                allowanceLoading ?
                                    <div type="button" class="">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div> : <div>Allowance</div>
                            }
                            
                        </button>
                    }
                    
                </div>
            </div>
        </div>  
    )
}

export default Redeem;