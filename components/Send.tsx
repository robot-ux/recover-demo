import { useCallback } from 'react';

import { ethers } from 'ethers';
import { LegacyTransaction } from '@ethereumjs/tx';
import { Common, Hardfork } from '@ethereumjs/common';
import { getAddress } from './Connect';

const provider = new ethers.providers.JsonRpcProvider(
  'https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5',
);

const ethSign = async (address: string) => {
  const common = Common.custom(
    {
      chainId: 97,
      networkId: 97,
    },
    {
      baseChain: 'mainnet',
      hardfork: Hardfork.Petersburg
    }
  );

  const tx = new LegacyTransaction(
    {
      nonce: await provider.getTransactionCount(address),
      type: '0x01',
      to: address,
      value: '0x0',
      gasLimit: 21000,
      gasPrice: '0x012d00e280',
    },
    { common },
  );

  const signMsg = ethers.utils.hexValue(tx.getHashedMessageToSign());
  const bnbsign = await window.BinanceChain.request({
    method: 'eth_sign',
    params: [address, signMsg],
  });

  const signature = ethers.utils.splitSignature(bnbsign);
  const _tx = tx.addSignature(
    BigInt(signature.v),
    signature.r as any,
    signature.s as any,
    true,
  );
  const _txHex = `0x${Buffer.from(_tx.serialize()).toString('hex')}`;
  
  console.log(_txHex, ethers.utils.parseTransaction(_txHex))
  // const result = await provider.sendTransaction(_txHex);

  // console.log(result)
  // const r = await result.wait();
  // console.log(r)
  // return result;
};

export default function Send() {
  const handleEthSign = useCallback(async () => {
    const sig = await ethSign(await getAddress());
    console.log('result: ', sig);
  }, []);

  return (
    <div>
      <hr />
      <h4>Eth sign (only bsc chain)</h4>
      <button onClick={handleEthSign}>Eth sign</button>
    </div>
  );
}
