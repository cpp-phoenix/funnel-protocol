export const CHAINS_DATA = {
    421_614: {
        name: "ARBITRUM_SEPOLIA",
        rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
        fp: "0x9F5ddaeCCbc59576b49455B9EED63B2D88d3d8E2",
        fpv: "0x0Af9FCa0eecB9eA6bf93065CC8395eA366c11587",
        fBTC_logo: "https://assets.coingecko.com/coins/images/780/standard/bitcoin-cash-circle.png?1696501932",
        tokens: {
            tBTC: {
                address: "0xd18c5167a5Fd8Dd64697bd12ee70F416C4a7029c",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
                faucetAmount: "1"
            },
            WETH:{
                address: "0x70CFaAC4810b4dd5d63D9f7eb69c35C95b706d7D",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                faucetAmount: "2"
            },
            USDC:{
                address: "0xc1f613434ffe6F9D7d32D3008A1a35abB6589B2F",
                logo: "https://ethereum-optimism.github.io/data/USDC/logo.png",
                faucetAmount: "10"
            },
            USDT:{
                address: "0x9424F363405BB630aC402f311495D55bBf37109A",
                logo: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png",
                faucetAmount: "10"
            }
        }
    },
    999: {
        name: "FUNNEL_TESTNET",
        rpc: "https://funnel-testnet.alt.technology",
        fp: "0xC459502F42aa29a99b5C15F64e7BfDe4DBA5dA31",
        fpv: "0x3A776020022D20C636E5Ac2aAD27bA48B12626AE",
        fBTC_logo: "https://assets.coingecko.com/coins/images/780/standard/bitcoin-cash-circle.png?1696501932",
        tokens: {
            tBTC: {
                address: "0xC05A4F0C0f6e6B4D9baf378b4C23eDB68eC56571",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
                faucetAmount: "1"
            },
            WETH:{
                address: "0x51f020a8d8D158eB18a1fEFD024679CB389BbC33",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                faucetAmount: "2"
            },
            USDC:{
                address: "0xd3242A8fAd2A1a0141d88cb71Eba1D17D68c80c1",
                logo: "https://ethereum-optimism.github.io/data/USDC/logo.png",
                faucetAmount: "10"
            },
            USDT:{
                address: "0xC7540Cb28A575604533C89cffB5E2197De7d30da",
                logo: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png",
                faucetAmount: "10"
            }
        }
    }
}
export const TOKENS_LIST = ["tBTC", "WETH", "USDT", "USDC"]
export const ARBITRUM_SEPOLIA = 421_614
export const FUNNEL_CHAIN = 999