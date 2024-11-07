import {useState } from "react"
import { ARBITRUM_SEPOLIA, FUNNEL_CHAIN, CHAINS_DATA } from "../constants/constants"

function Bridge () {
    const [selectToken, setSelectToken] = useState("fBTC")
    const [tokenBalance, setTokenBalance] = useState(0)
    const [fromChain, setFromChain] = useState(ARBITRUM_SEPOLIA)
    const [toChain, setToChain] = useState(FUNNEL_CHAIN)

    return (
        <div className="flex flex-row items-center justify-center  w-full h-4/5">
            <div className="flex flex-col justify-between rounded-lg w-[500px] h-[430px] bg-[#304256] border border-black p-3">
                <div className="text-[#C7F284]">
                    <div className="flex justify-center w-full py-2 text-md space-x-1 font-semibold text-white">
                        <div>Bridge</div>
                        <div className="text-[#C7F284]">{CHAINS_DATA[fromChain]["name"]}</div> 
                        <div>to</div>
                        <div className="text-[#C7F284]">{CHAINS_DATA[toChain]["name"]} (Alt Layer)</div>
                    </div>
                    <div className="static rounded border border-black flex justify-between w-full h-32 bg-[#121D28] flex items-center px-4">
                        <div className="space-y-1">
                            <div className="text-md">Amount</div>
                            <input type="number" id="first_name" class="focus:ring-[#121D28] focus:border-[#121D28] dark:focus:ring-[#121D28]dark:focus:border-[#121D28] bg-[#121D28] border border-[#121D28] dark:border-[#121D28] text-gray-900 text-sm rounded-lg block w-20 border p-2.5 dark:bg-[#121D28] dark:placeholder-gray-500 dark:text-white" placeholder="0" required />
                        </div>
                        <div className="flex flex-col items-center space-x-5">
                            <div className="flex flex-col items-center text-xs space-y-1">
                                <img className="w-10 h-10" src={CHAINS_DATA[fromChain]["fBTC_logo"]}/>
                                <div>{selectToken}</div>
                            </div>

                            <div className="text-xs text-gray-500">
                                Balance: {tokenBalance}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center h-7 my-2">
                        <svg className="h-7 w-7" class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit mui-1cw4hi4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDownwardIcon"><path d="m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"></path></svg> 
                    </div>

                    <div className="static rounded border border-black flex justify-center w-full h-32 bg-[#121D28] flex items-center px-4">
                        {/* <div className="space-y-1">
                            <div className="text-md">ARB</div>
                            <input type="number" id="first_name" class="focus:ring-[#121D28] focus:border-[#121D28] dark:focus:ring-[#121D28]dark:focus:border-[#121D28] bg-[#121D28] border border-[#121D28] dark:border-[#121D28] text-gray-900 text-sm rounded-lg block w-20 border p-2.5 dark:bg-[#121D28] dark:placeholder-gray-500 dark:text-white" placeholder="0" required />
                        </div> */}
                        <div className="flex flex-col items-center space-x-5">
                            <div className="flex flex-col items-center text-xs space-y-2">
                                <img className="w-10 h-10" src={CHAINS_DATA[toChain]["fBTC_logo"]}/>
                                <div>{selectToken} {CHAINS_DATA[toChain]["name"]}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                                Balance: {tokenBalance}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="w-full font-semibold">
                    {
                        <button className="rounded-lg bg-[#C7F284] w-full h-12 flex items-center justify-center">Bridge</button> 
                    }
                </div>
            </div>
        </div>  
    )
}

export default Bridge;