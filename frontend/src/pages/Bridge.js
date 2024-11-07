import {useEffect, useState } from "react"
import { simulateContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { ethers } from "ethers";
import { useAccount, useNetwork, useWalletClient, usePublicClient } from 'wagmi'
import { ARBITRUM_SEPOLIA, FUNNEL_CHAIN, CHAINS_DATA } from "../constants/constants"
import { config } from "../App";
import DummyERC20ABI from "../abis/DummyERC20.json"
import FunnelProtocolABI from "../abis/FunnelProtocol.json"
import FunnelProtocolVaultABI from "../abis/FunnelProtocolVault.json"

function Bridge () {
    const {address, isConnected, chain} = useAccount()

    const [selectToken, setSelectToken] = useState("fBTC")
    const [fromTokenBalance, setFromTokenBalance] = useState(0)
    const [toTokenBalance, setToTokenBalance] = useState(0)
    const [fromChain, setFromChain] = useState(chain.id)
    const [toChain, setToChain] = useState(chain.id)
    const [suffienceLiquidity, setSufficientLiquidity] = useState(false)
    const [tokenAmount, setTokenAmount] = useState(0)

    useEffect(() => {
        if(chain.id === ARBITRUM_SEPOLIA) {
            if(fromChain === ARBITRUM_SEPOLIA) {
                setToChain(FUNNEL_CHAIN)
                sourceTokenBalance(ARBITRUM_SEPOLIA)
                destTokenBalance(FUNNEL_CHAIN)
            } else {
                setToChain(ARBITRUM_SEPOLIA)
                sourceTokenBalance(FUNNEL_CHAIN)
                destTokenBalance(ARBITRUM_SEPOLIA)
            }
        }
    },[])

    const sourceTokenBalance = async (chainId) => {
        const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chainId].rpc);
        const dummyERC20 = new ethers.Contract(CHAINS_DATA[chainId]["fpv"], DummyERC20ABI, provider);

        const decimals = await dummyERC20.decimals()
        const _balance = await dummyERC20.balanceOf(address)
        const formattedBalance = ethers.formatUnits(_balance, decimals)
        setFromTokenBalance(formattedBalance)
    }

    const destTokenBalance = async (chainId) => {
        const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chainId].rpc);
        const dummyERC20 = new ethers.Contract(CHAINS_DATA[chainId]["fpv"], DummyERC20ABI, provider);
        const decimals = await dummyERC20.decimals()
        const _balance = await dummyERC20.balanceOf(address)
        const formattedBalance = ethers.formatUnits(_balance, decimals)
        setToTokenBalance(formattedBalance)
    }

    const checkAllowance = async (_amount) => {
        const ownerWallet = new ethers.Wallet(process.env.REACT_APP_OWNER_PRIVATE_KEY, CHAINS_DATA[fromChain]["rpc"])
        const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);
        const dummyERC20 = new ethers.Contract(CHAINS_DATA[chain.id]["fpv"], DummyERC20ABI, provider);
        const decimals = await dummyERC20.decimals()
        const allowance = await dummyERC20.allowance(address, CHAINS_DATA[fromChain]["fpv"])
        const formattedAllowance = ethers.formatUnits(allowance, decimals)
        console.log(allowance)
        if(parseFloat(formattedAllowance) < parseFloat(_amount)) {
            setSufficientLiquidity(false)
        } else {
            setSufficientLiquidity(true)
        }
    }

    const sendAllowanceTxn = async () => {
        if(tokenAmount > 0) {
            const provider = new ethers.JsonRpcProvider(CHAINS_DATA[fromChain].rpc);

            const dummyERC20 = new ethers.Contract(CHAINS_DATA[fromChain]["fpv"], DummyERC20ABI, provider);
            const decimals = await dummyERC20.decimals()
            const formattedAmount = ethers.parseUnits(tokenAmount.toString(), decimals)
            const ownerWallet = new ethers.Wallet(process.env.REACT_APP_OWNER_PRIVATE_KEY, CHAINS_DATA[fromChain]["rpc"])

            const { request } = await simulateContract(config, {
                abi:DummyERC20ABI,
                address: CHAINS_DATA[fromChain]["fpv"],
                functionName: 'approve',
                args: [
                    CHAINS_DATA[fromChain]["fp"],
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

    const initiateBridge = async () => {
        if(tokenAmount > 0) {
            const providerFrom = new ethers.JsonRpcProvider(CHAINS_DATA[fromChain].rpc);
            const signerFrom = new ethers.Wallet(process.env.REACT_APP_OWNER_PRIVATE_KEY, providerFrom);
            const dummyERC20From = new ethers.Contract(CHAINS_DATA[fromChain]["fpv"], FunnelProtocolVaultABI, providerFrom);
            const dummyERC20FromSigner = dummyERC20From.connect(signerFrom)

            const formattedBalance = ethers.parseUnits(tokenAmount.toString(), await dummyERC20FromSigner.decimals())
            console.log(formattedBalance)
            const { request } = await simulateContract(config, {
                abi:FunnelProtocolABI,
                address: CHAINS_DATA[fromChain]["fp"],
                functionName: 'burnFPV',
                args: [
                    formattedBalance
                ],
            })
            const _hash = await writeContract(config, request)

            const transactionReceipt = await waitForTransactionReceipt(config, {
                hash: _hash,
            })
            if(transactionReceipt["status"] === 'success') {
                const providerTo = new ethers.JsonRpcProvider(CHAINS_DATA[toChain].rpc);
                const signerTo = new ethers.Wallet(process.env.REACT_APP_OWNER_PRIVATE_KEY, providerTo);
                const dummyERC20To = new ethers.Contract(CHAINS_DATA[toChain]["fpv"], FunnelProtocolVaultABI, providerTo);
                const dummyERC20ToSigner = dummyERC20To.connect(signerTo)

                await dummyERC20ToSigner.mintSupply(formattedBalance, address)
            }
        }
    }
    if(chain.id === ARBITRUM_SEPOLIA) {
        return (
            <div className="flex flex-row items-center justify-center  w-full h-4/5">
                <div className="flex flex-col justify-between rounded-lg w-[500px] h-[430px] bg-[#304256] border border-black p-3">
                    <div className="text-[#C7F284]">
                        <div className="flex justify-center w-full py-2 text-md space-x-1 font-semibold text-white">
                            <div>Bridge</div>
                            <div className="text-[#C7F284]">{CHAINS_DATA[fromChain]["name"]}</div> 
                            <div>to</div>
                            <div className="text-[#C7F284]">{CHAINS_DATA[toChain]["name"]} (Alt-Layer)</div>
                        </div>
                        <div className="static rounded border border-black flex justify-between w-full h-32 bg-[#121D28] flex items-center px-4">
                            <div className="space-y-1">
                                <div className="text-md">Amount</div>
                                <input onChange={(e) => {checkAllowance(e.target.value); setTokenAmount(e.target.value);}} type="number" id="first_name" class="focus:ring-[#121D28] focus:border-[#121D28] dark:focus:ring-[#121D28]dark:focus:border-[#121D28] bg-[#121D28] border border-[#121D28] dark:border-[#121D28] text-gray-900 text-sm rounded-lg block w-20 border p-2.5 dark:bg-[#121D28] dark:placeholder-gray-500 dark:text-white" placeholder="0" required />
                            </div>
                            <div className="flex flex-col items-center space-x-5">
                                <div className="flex flex-col items-center text-xs space-y-1">
                                    <img className="w-10 h-10" src={CHAINS_DATA[fromChain]["fBTC_logo"]}/>
                                    <div>{selectToken}</div>
                                </div>

                                <div className="text-xs text-gray-500">
                                    Balance: {fromTokenBalance}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center h-7 my-2">
                            <svg className="h-7 w-7" class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit mui-1cw4hi4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDownwardIcon"><path d="m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"></path></svg> 
                        </div>

                        <div className="static rounded border border-black flex justify-center w-full h-32 bg-[#121D28] flex items-center px-4">
                            <div className="flex flex-col items-center space-x-5">
                                <div className="flex flex-col items-center text-xs space-y-2">
                                    <img className="w-10 h-10" src={CHAINS_DATA[toChain]["fBTC_logo"]}/>
                                    <div>{selectToken}: {CHAINS_DATA[toChain]["name"]}</div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Balance: {toTokenBalance}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="w-full font-semibold">
                        {
                            suffienceLiquidity ? 
                                <button onClick={() => initiateBridge()} className="rounded-lg bg-[#C7F284] w-full h-12 flex items-center justify-center">Bridge</button> 
                            : <button onClick={() => sendAllowanceTxn()} className="rounded-lg bg-[#C7F284] w-full h-12 flex items-center justify-center">Allowance</button> 
                        }
                    </div>
                </div>
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

export default Bridge;