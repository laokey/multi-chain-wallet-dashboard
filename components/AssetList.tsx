'use client';

import { useAssets } from '@/hooks/useAssets';
import { Asset } from '@/types';
import { TransferModal } from './TransferModal';
import { ApproveModal } from './ApproveModal';
import { useState } from 'react';

export function AssetList() {
  const { assets, loading } = useAssets();
  const [transferAsset, setTransferAsset] = useState<Asset | null>(null);
  const [approveAsset, setApproveAsset] = useState<Asset | null>(null);

  if (loading) {
    return (
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>资产列表</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>资产列表</h2>
        <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}>
          暂无资产
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>资产列表</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {assets.map((asset) => (
            <div
              key={asset.token.address}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.1)',
              }}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  {asset.token.symbol}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                  {asset.token.name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  {parseFloat(asset.balanceFormatted).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                  {asset.token.symbol}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {asset.token.address !== 'native' && (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setApproveAsset(asset)}
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    >
                      授权
                    </button>
                  </>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => setTransferAsset(asset)}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  转账
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {transferAsset && (
        <TransferModal
          asset={transferAsset}
          onClose={() => setTransferAsset(null)}
        />
      )}

      {approveAsset && (
        <ApproveModal
          asset={approveAsset}
          onClose={() => setApproveAsset(null)}
        />
      )}
    </>
  );
}

