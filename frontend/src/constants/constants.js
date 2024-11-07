export const CHAINS_DATA = {
    421_614: {
        name: "ARBITRUM_SEPOLIA",
        rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
        fp: "0x060c7365eA2D6F9efDD5787153dc4ee8D94cc5A7",
        fpv: "0x64a664711Abc0a37fCc963B649b8396d40f8BB69",
        fBTC_logo: "https://assets.coingecko.com/coins/images/780/standard/bitcoin-cash-circle.png?1696501932",
        tokens: {
            tBTC: {
                address: "0x41B804bACE642c878C03c3066B26c12d0A2ecc91",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
                faucetAmount: "1"
            },
            WETH:{
                address: "0x64Fd4835Bae9B00A4C50AAEeFC52a8F23Ee3B1bB",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                faucetAmount: "2"
            },
            USDC:{
                address: "0x47C1103B60F2e452b141650D8D24E99Ed0b5962c",
                logo: "https://ethereum-optimism.github.io/data/USDC/logo.png",
                faucetAmount: "10"
            },
            USDT:{
                address: "0x1987aDEE78B5221832F03DBd71CFde372Bbd4e83",
                logo: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png",
                faucetAmount: "10"
            }
        }
    },
    999: {
        name: "FUNNEL_TESTNET",
        rpc: "https://funnel-testnet.alt.technology",
        fp: "0x060c7365eA2D6F9efDD5787153dc4ee8D94cc5A7",
        fpv: "0x64a664711Abc0a37fCc963B649b8396d40f8BB69",
        fBTC_logo: "https://assets.coingecko.com/coins/images/780/standard/bitcoin-cash-circle.png?1696501932",
        tokens: {
            tBTC: {
                address: "0x41B804bACE642c878C03c3066B26c12d0A2ecc91",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
                faucetAmount: "1"
            },
            WETH:{
                address: "0x64Fd4835Bae9B00A4C50AAEeFC52a8F23Ee3B1bB",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                faucetAmount: "2"
            },
            USDC:{
                address: "0x47C1103B60F2e452b141650D8D24E99Ed0b5962c",
                logo: "https://ethereum-optimism.github.io/data/USDC/logo.png",
                faucetAmount: "10"
            },
            USDT:{
                address: "0x1987aDEE78B5221832F03DBd71CFde372Bbd4e83",
                logo: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png",
                faucetAmount: "10"
            }
        }
    }
}
export const TOKENS_LIST = ["tBTC", "WETH", "USDT", "USDC"]
export const ARBITRUM_SEPOLIA = 421_614
export const FUNNEL_CHAIN = 999