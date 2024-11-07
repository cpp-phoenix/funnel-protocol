import { ethers } from "ethers";
import { simulateContract, writeContract } from '@wagmi/core'
import { useEffect, useState } from "react";
import { CHAINS_DATA, ARBITRUM_SEPOLIA, TOKENS_LIST } from "../constants/constants";
import { useAccount, useNetwork, useWalletClient, usePublicClient } from 'wagmi'
import { config } from "../App";
import { waitForTransactionReceipt } from '@wagmi/core'
import FunnelProtocolABI from "../abis/FunnelProtocol.json"
import DummyERC20ABI from "../abis/DummyERC20.json"


function Faucet () {

    const {address, isConnected, chain} = useAccount()

    const mintFaucet = async (_address, _amount) => {
        if(_amount > 0) {
            const provider = new ethers.JsonRpcProvider(CHAINS_DATA[chain.id].rpc);

            const dummyERC20 = new ethers.Contract(_address, DummyERC20ABI, provider);
            const decimals = await dummyERC20.decimals()
            const formattedAmount = ethers.parseUnits(_amount.toString(), decimals)

            const { request } = await simulateContract(config, {
                abi: DummyERC20ABI,
                address: _address,
                functionName: 'mintFaucet',
                args: [
                    formattedAmount
                ],
            })
            const _hash = await writeContract(config, request)
            const transactionReceipt = await waitForTransactionReceipt(config, {
                hash: _hash,
            })

            if(transactionReceipt["status"] === 'success') {
               
            }
        }
    }
    if(chain.id === ARBITRUM_SEPOLIA) {
        return (
            <div className="flex flex-row items-center justify-center  w-full h-4/5">
                <div className="border flex flex-col justify-between rounded-lg w-[500px] h-[270px] bg-[#304256] border border-black p-3">
                    {
                        TOKENS_LIST.map(token => {
                            return (
                                <button onClick={() => mintFaucet(CHAINS_DATA[chain.id]["tokens"][token]["address"], CHAINS_DATA[chain.id]["tokens"][token]["faucetAmount"])} className="rounded-lg hover:bg-[#121D28] p-2 text-white flex justify-between items-center space-x-2">
                                    <div className="flex space-x-2 items-center">
                                        <div><img className="w-10 h-10" src={CHAINS_DATA[chain.id]["tokens"][token]["logo"]}/></div>
                                        <div>Mint</div>
                                        <div>{token}</div>
                                    </div>
                                    <div>
                                        <button className="rounded-lg bg-[#C7F284] text-black font-semibold p-2 px-10">Mint</button>
                                    </div>
                                </button>
                            )
                            
                        })
                    }
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

export default Faucet;