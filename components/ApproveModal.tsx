'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, Address, isAddress, maxUint256 } from 'viem';
import { erc20Abi } from 'viem';
import { Asset } from '@/types';

interface ApproveModalProps {
  asset: Asset;
  onClose: () => void;
}

export function ApproveModal({ asset, onClose }: ApproveModalProps) {
  const { address } = useAccount();
  const [spender, setSpender] = useState('');
  const [amount, setAmount] = useState('');
  const [useMax, setUseMax] = useState(false);
  const [error, setError] = useState('');

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: asset.token.address as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, spender as Address] : undefined,
    query: {
      enabled: !!address && !!spender && isAddress(spender),
    },
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (spender && isAddress(spender) && allowance !== undefined) {
      const allowanceFormatted = formatUnits(allowance as bigint, asset.token.decimals);
      setAmount(allowanceFormatted);
    }
  }, [allowance, asset.token.decimals, spender]);

  const handleApprove = async () => {
    setError('');

    if (!spender || !isAddress(spender)) {
      setError('请输入有效的授权地址');
      return;
    }

    if (!useMax && (!amount || parseFloat(amount) <= 0)) {
      setError('请输入有效的授权金额');
      return;
    }

    try {
      writeContract({
        address: asset.token.address as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [
          spender as Address,
          useMax ? maxUint256 : parseUnits(amount, asset.token.decimals),
        ],
      });
    } catch (err: any) {
      setError(err.message || '授权失败');
    }
  };

  const handleClose = () => {
    if (isConfirmed) {
      refetchAllowance();
      onClose();
      setSpender('');
      setAmount('');
      setError('');
    } else if (!isPending && !isConfirming) {
      onClose();
    }
  };

  const allowanceFormatted =
    allowance !== undefined
      ? formatUnits(allowance as bigint, asset.token.decimals)
      : '0';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem' }}>
          {asset.token.symbol} 授权
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            授权地址 (Spender)
          </label>
          <input
            type="text"
            className="input"
            value={spender}
            onChange={(e) => {
              setSpender(e.target.value);
              setAmount('');
            }}
            placeholder="0x..."
            disabled={isPending || isConfirming || isConfirmed}
          />
        </div>

        {spender && isAddress(spender) && allowance !== undefined && (
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
              当前授权额度 (Allowance):
            </div>
            <div>
              {parseFloat(allowanceFormatted).toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })}{' '}
              {asset.token.symbol}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            授权金额
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="number"
              className="input"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setUseMax(false);
              }}
              placeholder="0.0"
              step="any"
              disabled={isPending || isConfirming || isConfirmed || useMax}
            />
            <button
              className="btn btn-secondary"
              onClick={() => {
                setUseMax(true);
                setAmount('无限');
              }}
              disabled={isPending || isConfirming || isConfirmed}
              style={{ whiteSpace: 'nowrap' }}
            >
              最大额度
            </button>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
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
            {error || writeError?.message || '授权失败'}
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
            授权成功！交易哈希: {hash?.slice(0, 10)}...{hash?.slice(-8)}
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
            onClick={handleApprove}
            disabled={isPending || isConfirming || isConfirmed}
          >
            {isPending
              ? '确认中...'
              : isConfirming
              ? '处理中...'
              : isConfirmed
              ? '已完成'
              : '确认授权'}
          </button>
        </div>
      </div>
    </div>
  );
}

