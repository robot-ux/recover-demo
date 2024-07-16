/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react';

export const isWalletInstalled = () => {
  return typeof window !== 'undefined' && !!window.BinanceChain;
};

export const getAddress = async () => {
  const addresses = await window.BinanceChain.request({
    method: 'eth_requestAccounts',
  });
  return addresses?.[0];
};

export default function Connect() {
  if (!isWalletInstalled()) {
    return <div>Please install BNBChain Wallet or Trust Wallet first</div>;
  }

  const [chainId, setChainId] = useState('');
  const [address, setAddress] = useState('');

  const handleGetAddress = useCallback(async () => {
    const address = await getAddress();
    console.log('getAddress: ', address);
    setAddress(address);
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
  }, [handleGetAddress]);
  const listenChainChange = useCallback(() => {
    window.BinanceChain.on('chainChanged', async (chainId: string) => {
      console.log('chainChanged: ', chainId);
      setChainId(chainId);
      handleGetAddress();
    });
  }, [handleGetAddress]);

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
  }, [handleGetAddress, listenAccountChange, listenChainChange]);

  const handleSwitchToBscMainnet = useCallback(() => {
    window?.BinanceChain.switchNetwork('bsc-mainnet');
    // window.BinanceChain.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x38' }] });
  }, []);
  const handleSwitchToBscTestnet = useCallback(() => {
    window?.BinanceChain.switchNetwork('bsc-testnet');
  }, []);
  const handleSwitchToBbcMainnet = useCallback(() => {
    window?.BinanceChain.switchNetwork('bbc-mainnet');
  }, []);
  const handleSwitchToBbcTestnet = useCallback(() => {
    window?.BinanceChain.switchNetwork('bbc-testnet');
  }, []);

  // sign
  const [bbcSignedMsg, setBbcSignedMsg] = useState('');
  const handleBbcSign = useCallback(async () => {
    const signed = await window.BinanceChain.bnbSign(
      await getAddress(),
      'hello',
    );
    setBbcSignedMsg(signed);
  }, []);

  useEffect(() => {
    handleAutoConnect();
  }, [handleAutoConnect]);

  return (
    <main>
      <div>ChainId: {chainId}</div>
      <div>Address: {address}</div>
      <button onClick={handleGetAddress}>Get Address</button>

      <h4>Switch Network</h4>
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

      <h4>Sign</h4>
      <button onClick={handleBbcSign}>Bbc Sign</button>
      <div style={{ wordWrap: 'break-word' }}>
        Bbc sign result: {JSON.stringify(bbcSignedMsg)}
      </div>
    </main>
  );
}
