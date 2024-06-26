import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    BinanceChain: {
      on: Function;
      request: Function;
      switchNetwork: Function;
    };
  }
}

const networkMapping = {
  'bsc-mainnet': '0x38',
  'bsc-testnet': '0x61',
  'bbc-mainnet': 'Binance-Chain-Tigris',
  'bbc-testnet': 'Binance-Chain-Ganges',
};

export const isWalletInstalled = () => {
  return typeof window !== 'undefined' && !!window.BinanceChain;
};

export default function Connect() {
  if (!isWalletInstalled()) {
    return <div>Please install BNBChain Wallet or Trust Wallet first</div>;
  }

  const [chainId, setChainId] = useState('');
  const [address, setAddress] = useState('');

  const handleGetAddress = useCallback(async () => {
    const addresses = await window.BinanceChain.request({
      method: 'eth_requestAccounts',
    });
    console.log('getAddress: ', addresses);
    setAddress(addresses?.[0]);
  }, []);

  const handleAutoConnect = useCallback(() => {
    window.BinanceChain.on(
      'connect',
      async ({ chainId }: { chainId: string }) => {
        console.log('WalletConnect: ', chainId);
        if (chainId) {
          setChainId(chainId);
          handleGetAddress();

          listenAccountChange();
          listenChainChange();
        }
      },
    );
  }, []);

  // listen wallet events
  const listenAccountChange = useCallback(() => {
    window.BinanceChain.on(
      'accountsChanged',
      async (accounts: Array<string>) => {
        console.log('accountsChanged: ', accounts);
        handleGetAddress();
      },
    );
  }, []);
  const listenChainChange = useCallback(() => {
    window.BinanceChain.on('chainChanged', async (chainId: string) => {
      console.log('chainChanged: ', chainId);
      setChainId(chainId);
      handleGetAddress();
    });
  }, []);

  const handleSwitchToBscMainnet = useCallback(() => {
    window?.BinanceChain.switchNetwork('bsc-mainnet');
  }, [chainId]);
  const handleSwitchToBscTestnet = useCallback(() => {
    window?.BinanceChain.switchNetwork('bsc-testnet');
  }, [chainId]);
  const handleSwitchToBbcMainnet = useCallback(() => {
    window?.BinanceChain.switchNetwork('bbc-mainnet');
  }, [chainId]);
  const handleSwitchToBbcTestnet = useCallback(() => {
    window?.BinanceChain.switchNetwork('bbc-testnet');
  }, [chainId]);

  useEffect(() => {
    handleAutoConnect();
  }, []);

  return (
    <main>
      <div>ChainId: {chainId}</div>
      <div>Address: {address}</div>
      <button onClick={handleGetAddress}>Get Address</button>

      <hr />
      <div>Switch Network</div>
      <button onClick={handleSwitchToBscMainnet}>
        Switch Network to bsc-mainnet
      </button>
      <button onClick={handleSwitchToBscTestnet}>
        Switch Network to bsc-testnet
      </button>
      <button onClick={handleSwitchToBbcMainnet}>
        Switch Network to bbc-mainnet
      </button>
      <button onClick={handleSwitchToBbcTestnet}>
        Switch Network to bbc-testnet
      </button>
    </main>
  );
}
