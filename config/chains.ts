import { mainnet, polygon, bsc, arbitrum, optimism, sepolia } from 'viem/chains';

export const supportedChains = [
  mainnet,
  sepolia,
  polygon,
  bsc,
  arbitrum,
  optimism,
];

export const chainNames: Record<number, string> = {
  1: 'Ethereum',
  11155111: 'Sepolia',
  137: 'Polygon',
  56: 'BSC',
  42161: 'Arbitrum',
  10: 'Optimism',
};

