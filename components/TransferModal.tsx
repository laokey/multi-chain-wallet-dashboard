'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, Address, isAddress } from 'viem';
import { erc20Abi } from 'viem';
import { Asset } from '@/types';

interface TransferModalProps {
  asset: Asset;
  onClose: () => void;
}

export function TransferModal({ asset, onClose }: TransferModalProps) {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const isNative = asset.token.address === 'native';

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleTransfer = async () => {
    setError('');

    if (!toAddress || !isAddress(toAddress)) {
      setError('请输入有效的接收地址');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('请输入有效的转账金额');
      return;
    }

    try {
      if (isNative) {
        // ETH 转账
        writeContract({
          to: toAddress as Address,
          value: parseUnits(amount, asset.token.decimals),
        });
      } else {
        // ERC20 转账
        writeContract({
          address: asset.token.address as Address,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [toAddress as Address, parseUnits(amount, asset.token.decimals)],
        });
      }
    } catch (err: any) {
      setError(err.message || '转账失败');
    }
  };

  const handleClose = () => {
    if (isConfirmed) {
      onClose();
      setToAddress('');
      setAmount('');
      setError('');
    } else if (!isPending && !isConfirming) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem' }}>
          {isNative ? 'ETH' : asset.token.symbol} 转账
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            接收地址
          </label>
          <input
            type="text"
            className="input"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            disabled={isPending || isConfirming || isConfirmed}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            转账金额
          </label>
          <input
            type="number"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="any"
            max={asset.balanceFormatted}
            disabled={isPending || isConfirming || isConfirmed}
          />
          <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.25rem' }}>
            可用余额: {parseFloat(asset.balanceFormatted).toLocaleString()}{' '}
            {asset.token.symbol}
          </div>
        </div>

        {(error || writeError) && (
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 0, 0, 0.1)',
              borderRadius: '6px',
              color: '#ff4444',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            {error || writeError?.message || '转账失败'}
          </div>
        )}

        {isConfirmed && (
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(0, 255, 0, 0.1)',
              borderRadius: '6px',
              color: '#00aa00',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            转账成功！交易哈希: {hash?.slice(0, 10)}...{hash?.slice(-8)}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isPending || isConfirming}
          >
            {isConfirmed ? '关闭' : '取消'}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleTransfer}
            disabled={isPending || isConfirming || isConfirmed}
          >
            {isPending
              ? '确认中...'
              : isConfirming
              ? '处理中...'
              : isConfirmed
              ? '已完成'
              : '确认转账'}
          </button>
        </div>
      </div>
    </div>
  );
}

