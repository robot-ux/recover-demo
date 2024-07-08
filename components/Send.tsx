import { useCallback } from 'react'

import { getAddress } from './Connect'
import { LegacyTransaction } from '@ethereumjs/tx';
import {ethers} from 'ethers'
import { RLP } from '@ethereumjs/rlp'


const provider = new ethers.providers.JsonRpcProvider('https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5');

const ethSign = async (address: string) => {
  const tx = new LegacyTransaction({
    nonce: await provider.getTransactionCount(address),
    type: '0x01',
    to: address,
    value: '0x0',
    gasLimit: 21000,
  });

  const signMsg = tx.raw().map(it => ethers.utils.hexlify(it)).join('')
  const signMsg2 = tx.getMessageToSign().map(it => ethers.utils.hexlify(it)).join('');
  console.log(signMsg, signMsg2, ethers.utils.hexlify(RLP.encode(tx.getMessageToSign())), ethers.utils.hexlify(RLP.encode(tx.raw())))

  const sig = await window.BinanceChain
  .request({
    method: 'personal_sign',
    params: [address, signMsg2],
  });

  const signature = ethers.utils.splitSignature(sig);
  const _tx = tx.addSignature(BigInt(signature.v), signature.r as any, signature.s as any);
  const _txHex = `0x${Buffer.from(_tx.serialize()).toString('hex')}`;

  console.log(sig, _txHex, _tx.verifySignature())

  const result = await provider.sendTransaction(_txHex);
  
  console.log(result)
  return result;
}

export default function Send() {
  const handleEthSign = useCallback(async () => {
    const sig = await ethSign(await getAddress());
    console.log('result: ', sig);
  }, [])

  return (
    <div>
      <hr />
      <h4>Eth sign (only bsc chain)</h4>
      <button onClick={handleEthSign}>Eth sign</button>
    </div>
  );
}
