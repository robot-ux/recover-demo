import dynamic from 'next/dynamic';

declare global {
  interface Window {
    BinanceChain: {
      on: Function;
      request: Function;
      switchNetwork: Function;
      bnbSign: Function;
    };
  }
}

const Connect = dynamic(() => import('../components/Connect'), { ssr: false })
const Send = dynamic(() => import('../components/Send'), { ssr: false })
// const WalletConnect = dynamic(() => import('../components/WalletConnect'), { ssr: false })
const WalletConnect = dynamic(() => import('../components/walletconnect/Index'), { ssr: false })

export default function Home() {
  return (
    <>
    <Connect />
    <Send />
    <WalletConnect />
    </>
  );
}
