'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { AssetList } from '@/components/AssetList';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="container" style={{ paddingTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          多链钱包资产看板
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
          查看和管理您的 ETH 与 ERC20 资产
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <WalletConnect />
      </div>

      {isConnected && (
        <div>
          <AssetList />
        </div>
      )}

      {!isConnected && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
            请连接钱包以查看您的资产
          </p>
        </div>
      )}
    </main>
  );
}

