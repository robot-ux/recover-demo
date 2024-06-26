import dynamic from 'next/dynamic';

const Connect = dynamic(() => import('./Connect'), { ssr: false })

export default function Home() {
  return <Connect />;
}
