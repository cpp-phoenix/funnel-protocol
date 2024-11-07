import { ethers } from "ethers";
import { simulateContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { useEffect, useState } from "react";
import { CHAINS_DATA, ARBITRUM_SEPOLIA, FUNNEL_CHAIN, TOKENS_LIST } from "../constants/constants";
import { useAccount, useNetwork, useWalletClient, usePublicClient } from 'wagmi'
import { config } from "../App";
import FunnelProtocolABI from "../abis/FunnelProtocol.json"
import DummyERC20ABI from "../abis/DummyERC20.json"

function Mint () {

    const {address, isConnected, chain} = useAccount()

    const { data: signer } = useWalletClient();

    const [inputAmount, setInputAmount] = useState(0)
    const [selectToken, setSelectToken] = useState("tBTC")
    const [isVisible, setIsVisible] = useState(false)
    const [fbtcEstimation, setfbtcEstimation] = useState(0)
    const [tokenBalance, setTokenBalance] = useState(0)
    const [suffienceLiquidity, setSufficientLiquidity] = useState(false)
    const [allowanceLoading, setAllowanceLoading] = useState(false)
    const [mintLoading, setMintLoading] = useState(false)

    useEffect(() => {
        if(chain.id === ARBITRUM_SEPOLIA) {
            updateAmount(selectToken)
        }
    }, [])

    const checkAllowance = async (token, amount) => {
        const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);
        const dummyERC20 = new ethers.Contract(CHAINS_DATA[chain.id]["tokens"][token].address, DummyERC20ABI, provider);
        const decimals = await dummyERC20.decimals()
        const allowance = await dummyERC20.allowance(address, CHAINS_DATA[chain.id]["fp"])
        const formattedAllowance = ethers.formatUnits(allowance, decimals)

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

            const dummyERC20 = new ethers.Contract(CHAINS_DATA[chain.id]["tokens"][selectToken].address, DummyERC20ABI, provider);
            const decimals = await dummyERC20.decimals()
            const formattedAmount = ethers.parseUnits(inputAmount.toString(), decimals)

            // const signedDummyERC20 = dummyERC20.connect(signer)
            // const txn = await signedDummyERC20.approve(CHAINS_DATA[chain.id]["fp"], formattedAmount)

            const { request } = await simulateContract(config, {
                abi:DummyERC20ABI,
                address: CHAINS_DATA[chain.id]["tokens"][selectToken].address,
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

    const sendMintTxn = async () => {
        if(inputAmount > 0){
            const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);

            const dummyERC20 = new ethers.Contract(CHAINS_DATA[chain.id]["tokens"][selectToken].address, DummyERC20ABI, provider);
            const decimals = await dummyERC20.decimals()
            const formattedAmount = ethers.parseUnits(inputAmount.toString(), decimals)

            const { request } = await simulateContract(config, {
                abi: FunnelProtocolABI,
                address: CHAINS_DATA[chain.id]["fp"],
                functionName: 'deposit',
                args: [
                    CHAINS_DATA[chain.id]["tokens"][selectToken].address,
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
        const dummyERC20 = new ethers.Contract(CHAINS_DATA[chain.id]["tokens"][token].address, DummyERC20ABI, provider);
        const balance = await dummyERC20.balanceOf(address)
        const decimals = await dummyERC20.decimals()
        const balanceWithDecimals = ethers.formatUnits(balance, decimals)

        setTokenBalance(balanceWithDecimals)
    }

    const estimatefBTC = async (_inputAmount) => {
        if(_inputAmount > 0) {
            setInputAmount(_inputAmount)
            checkAllowance(selectToken, _inputAmount)
            const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);
            const dummyERC20 = new ethers.Contract(CHAINS_DATA[chain.id]["tokens"][selectToken].address, DummyERC20ABI, provider);
            const decimals = await dummyERC20.decimals()
            const formattedBalance = ethers.parseUnits(_inputAmount.toString(), decimals)

            const funnelContract = new ethers.Contract(CHAINS_DATA[chain.id]["fp"], FunnelProtocolABI, provider);

            const fBTCContract = new ethers.Contract(CHAINS_DATA[chain.id]["fpv"], DummyERC20ABI, provider);
            
            const fBTC = await funnelContract.convertToShares(CHAINS_DATA[chain.id]["tokens"][selectToken].address, formattedBalance)
            
            const fBTCDecimals = await fBTCContract.decimals()
            const fBTCwithDecimals = ethers.formatUnits(fBTC, fBTCDecimals)
            setfbtcEstimation(fBTCwithDecimals)
        } else {
            setfbtcEstimation(0)
        }
    }

    function TokensDropDown () {

        return (
            <div className={`${!isVisible ? "hidden " : " "} backdrop-blur-lg absolute w-full h-full flex items-center justify-center`}>
                <div className="flex flex-col justify-between rounded-lg border w-[500px] h-[150px] p-4 bg-[#304256]">
                    <div className="flex justify-between items-center">
                        <div className="text-white text-2xl">Select a token</div>
                        <button onClick={() => setIsVisible(!isVisible)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5.70696 5.70696C5.31643 6.09748 5.31643 6.73065 5.70696 7.12117L10.6567 12.0709L5.70697 17.0207C5.31645 17.4112 5.31645 18.0444 5.70697 18.4349C6.0975 18.8254 6.73066 18.8254 7.12118 18.4349L12.0709 13.4851L17.0207 18.4349C17.4112 18.8254 18.0444 18.8254 18.4349 18.4349C18.8254 18.0444 18.8254 17.4112 18.4349 17.0207L13.4851 12.0709L18.4349 7.12117C18.8254 6.73065 18.8254 6.09748 18.4349 5.70696C18.0444 5.31643 17.4112 5.31643 17.0207 5.70696L12.0709 10.6567L7.12117 5.70696C6.73064 5.31643 6.09748 5.31643 5.70696 5.70696Z" fill="white" fill-opacity="0.5"></path></svg></button>
                    </div>
                    <div className="border border-[#C7F284] my-3"></div>
                    <div className="flex h-12 justify-between">
                        {
                            TOKENS_LIST.map(token => {
                                return (
                                    <button onClick={() => {setIsVisible(!isVisible); setSelectToken(token); updateAmount(token)}} className="rounded-lg hover:bg-[#121D28] p-2 text-white flex items-center space-x-2">
                                        <div><img className="w-10 h-10" src={CHAINS_DATA[chain.id]["tokens"][token]["logo"]}/></div>
                                        <div>{token}</div>
                                    </button>
                                )
                                
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
    if(chain.id === ARBITRUM_SEPOLIA) {
        return (
            <div className="flex flex-row items-center justify-center  w-full h-4/5">
                <div className="flex flex-col justify-between rounded-lg w-[500px] h-[270px] bg-[#304256] border border-black p-3">
                    <div className="text-[#C7F284]">
                        <div className="flex w-full py-1 text-2xl text-white">Mint fBTC</div>
                        <div className="static rounded border border-black flex justify-between w-full h-32 bg-[#121D28] flex items-center px-4">
                            <div className="space-y-1">
                                <div className="text-md">Amount</div>
                                <input onChange={(e) => {estimatefBTC(e.target.value)}} type="number" id="first_name" class="focus:ring-[#121D28] focus:border-[#121D28] dark:focus:ring-[#121D28]dark:focus:border-[#121D28] bg-[#121D28] border border-[#121D28] dark:border-[#121D28] text-gray-900 text-sm rounded-lg block w-20 border p-2.5 dark:bg-[#121D28] dark:placeholder-gray-500 dark:text-white" placeholder="0" required />
                            </div>
                            <button onClick={() => setIsVisible(!isVisible)} className="space-y-1 flex flex-col items-end relative inline-block text-left " id="menu-button" aria-expanded="true" aria-haspopup="true">
                                <div className="flex items-center space-x-2">
                                    <div className="flex flex-col items-center text-xs space-y-1">
                                        <img className="w-10 h-10" src={CHAINS_DATA[chain.id]["tokens"][selectToken]["logo"]} />
                                        <div>{selectToken}</div>
                                    </div>
                                    <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7.70711 9.29289C7.31658 8.90237 6.68342 8.90237 6.29289 9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 10.7071L11.2929 15.7071C11.6834 16.0976 12.3166 16.0976 12.7071 15.7071L17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289C17.3166 8.90237 16.6834 8.90237 16.2929 9.29289L12 13.5858L7.70711 9.29289Z" fill="white" fill-opacity="0.5"></path></svg></div>
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
                                <div className="text-white">fBTC Estimate: </div>
                                <div className="pl-1 text-white">{fbtcEstimation}</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full font-semibold">
                        {
                            suffienceLiquidity ? 
                            <button onClick={() => sendMintTxn()} className="rounded-lg bg-[#C7F284] w-full h-12 flex items-center justify-center">Mint</button> :
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
                <TokensDropDown/>
            </div>  
        ) 
    } else {
        return (
            <div className="flex flex-row items-center justify-center text-white text-2xl w-full h-4/5">
                Not Supported Yet!
            </div>
        )
    }
}

export default Mint;