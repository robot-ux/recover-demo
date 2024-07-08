import React, { useEffect, useState } from 'react';

import { useWalletConnectClient } from './ClientContext';
import { DEFAULT_CHAINS } from '../../utils/helpers';

interface IFormattedRpcResponse {
  method?: string;
  address?: string;
  valid?: boolean;
  result: string;
}


export default function App() {
  const [rpcResult, setRpcResult] = useState<IFormattedRpcResponse | null>();

  const [modal, setModal] = useState('');

  const closeModal = () => setModal('');

  // Initialize the WalletConnect client.
  const {
    client,
    pairings,
    session,
    connect,
    disconnect,
    accounts,
    isInitializing,
    setChains,
  } = useWalletConnectClient();

  // const { chainData } = useChainData();

  useEffect(() => {
    setChains(DEFAULT_CHAINS);
  }, [setChains]);

  // Close the pairing modal after a session is established.
  useEffect(() => {
    if (session && modal === 'pairing') {
      closeModal();
    }
  }, [session, modal]);

  const onConnect = () => {
    if (typeof client === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    // Suggest existing pairings (if any).
    if (pairings.length) {
      // openPairingModal();
      connect(pairings[0])
    } else {
      // If no existing pairings are available, trigger `WalletConnectClient.connect`.
      connect();
    }
  };

  const testSignAmino = async (account: string) => {
    // test amino sign doc
    const signDoc = 'hello';

    const address = account.split(':').pop();

    if (!address) {
      throw new Error(`Could not derive address from account: ${account}`);
    }

    // cosmos_signAmino params
    const params = { address: address, message: signDoc };

    const result = await client!.request({
      topic: session!.topic,
      chainId: DEFAULT_CHAINS[0],
      request: {
        method: 'bbc_sign',
        params,
      },
    });

    setRpcResult({
      method: 'bbc_sign',
      address,
      // valid,
      result: result as string,
    });
  };

  return (
    <div>
      <hr />
      <h4>WalletConnectDemo: (only beacon chain)</h4>

      {accounts.length > 0 ? (
        <>
          <button onClick={disconnect}>Disconnect</button>
          <div>
            Content: {isInitializing ? 'Loading...' : JSON.stringify(accounts)}
          </div>
          <div style={{ wordWrap: 'break-word' }}>
            Result: {JSON.stringify(rpcResult)}
          </div>
          <button onClick={() => testSignAmino(accounts[0])}>BBC Sign</button>
        </>
      ) : (
        <>
          <button onClick={onConnect}>Connect</button>
        </>
      )}
    </div>
  );
}
