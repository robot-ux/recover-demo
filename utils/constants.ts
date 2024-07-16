
export const DEFAULT_PROJECT_ID = '44943520ff05e5b6e394f06c7c653195';
export const DEFAULT_LOGGER = 'info';
export const DEFAULT_RELAY_URL = 'wss://relay.walletconnect.com';
export const DEFAULT_METADATA = {
    name: 'WalletConnectDemo',
    description: 'WalletConnect Demo',
    url: 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

export const DEFAULT_COSMOS_METHODS = ['bbc_sign'];
export const bbcChainData = {
  "Binance-Chain-Ganges": {
    name: "BNB Beacon Chain Testnet",
    id: 'bbc:Binance-Chain-Ganges',
    rpc: ["https://rpc.cosmos.network"],
    slip44: 118,
    testnet: true,
  },
};
