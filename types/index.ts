export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface Asset {
  token: Token;
  balance: string;
  balanceFormatted: string;
  usdValue?: number;
}

export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

