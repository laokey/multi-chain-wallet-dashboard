'use client';

import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { erc20Abi, formatUnits, Address } from 'viem';
import { useState, useEffect } from 'react';
import { Asset, Token } from '@/types';

// 常见 ERC20 代币地址（示例）
const COMMON_TOKENS: Record<number, Token[]> = {
  1: [
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
  ],
  11155111: [
    {
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
  ],
  137: [
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
  ],
};

export function useAssets() {
  const { address, chainId } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const tokens = chainId ? COMMON_TOKENS[chainId] || [] : [];
  const tokenAddresses = tokens.map((t) => t.address as Address);

  const contracts = tokenAddresses.map((tokenAddress) => ({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf' as const,
    args: address ? [address as Address] : undefined,
  }));

  const { data: balances, isLoading: balancesLoading } = useReadContracts({
    contracts: contracts.length > 0 ? contracts : [],
    query: {
      enabled: !!address && tokenAddresses.length > 0,
    },
  });

  useEffect(() => {
    if (!address || !chainId) {
      setAssets([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const newAssets: Asset[] = [];

    // ETH 余额
    if (ethBalance) {
      newAssets.push({
        token: {
          address: 'native',
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
        },
        balance: ethBalance.value.toString(),
        balanceFormatted: formatUnits(ethBalance.value, 18),
      });
    }

    // ERC20 代币余额
    if (balances && balances.length === tokens.length) {
      balances.forEach((result, index) => {
        if (result.status === 'success' && result.result) {
          const token = tokens[index];
          const balance = result.result as bigint;
          if (balance > 0n) {
            newAssets.push({
              token,
              balance: balance.toString(),
              balanceFormatted: formatUnits(balance, token.decimals),
            });
          }
        }
      });
    }

    setAssets(newAssets);
    setLoading(balancesLoading || false);
  }, [address, chainId, ethBalance, balances, balancesLoading, tokens]);

  return { assets, loading };
}

