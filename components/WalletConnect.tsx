import UniversalProvider from '@walletconnect/universal-provider';
import { useCallback, useEffect, useState } from 'react';
import { WalletConnectModal } from '@walletconnect/modal'
import { stringToHex } from 'viem';

const networkMapping = {
  'bsc-mainnet': +0x38,
  'bsc-testnet': +0x61,
  'bbc-mainnet': 'Binance-Chain-Tigris',
  'bbc-testnet': 'Binance-Chain-Ganges',
};

const walletConnectModal = new WalletConnectModal({
  projectId: '44943520ff05e5b6e394f06c7c653195'
})

export const initProvider = async () => {
  //  Initialize the provider
  const provider = await UniversalProvider.init({
    projectId: '44943520ff05e5b6e394f06c7c653195',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'React App',
      description: 'React App for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
  });


  return provider;
};

export const connect = async (provider: UniversalProvider) => {
  //  create sub providers for each namespace/chain
  const res = await provider.client.connect({
    optionalNamespaces: {
      bbc: {
        methods: [
          'bbc_sign',
        ],
        chains: ['bbc:Binance-Chain-Ganges'],
        events: ['chainChanged', 'accountsChanged'],
      },
      eip155: {
        methods: [
          'eth_sendTransaction',
          'eth_sign',
          'personal_sign',
          'eth_signTypedData',
        ],
        chains: ['eip155:56', 'eip155:97'],
        events: ['chainChanged', 'accountsChanged'],
      }
    },
    // pairingTopic: '<123...topic>', // optional topic to connect to
    // skipPairing: false, // optional to skip pairing ( later it can be resumed by invoking .pair())
  });

  console.log('res', res, provider.uri);
  return res;
}

export default function WalletConnect() {
  const [_pv, setProvider] = useState<UniversalProvider>();

  useEffect(() => {
    (async () => {
      const provider = await initProvider();
      setProvider(provider);
    })();
  }, []);


  const handleConnect = useCallback(async () => {
    console.log('pv: ', _pv);
    const { uri, approval } = await connect(_pv!);
    await walletConnectModal.openModal({ uri });
    const res = await approval();
    console.log("approval: ", res)
    walletConnectModal.closeModal();
  }, [_pv])

  const handleBBCSign = useCallback(async () => {
    await _pv?.request({
      method: 'bbc_sign',
      params: {
        address: _pv.client,
        message: stringToHex('hello, world')
      },
    });
  }, [_pv])

  return <div>
    <button onClick={handleConnect}>WalletConnect</button>
    <button onClick={handleBBCSign}>BBC Sign</button>
  </div>
}
