'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { chainNames } from '@/config/chains';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  return (
    <div className="wallet-connect">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <ConnectButton />
        {isConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              当前网络: {chainNames[chainId] || `Chain ${chainId}`}
            </span>
            <select
              value={chainId}
              onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'inherit',
              }}
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chainNames[chain.id] || chain.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

