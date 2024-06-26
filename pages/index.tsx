import dynamic from 'next/dynamic';

const Connect = dynamic(() => import('./connect'), { ssr: false })

export default function Home() {
  return <Connect />;
}
