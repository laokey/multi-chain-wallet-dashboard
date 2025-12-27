# 多链钱包资产看板 DApp

一个支持多链的钱包资产看板 DApp，展示 ETH 与 ERC20 资产，并支持转账与授权功能。

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **wagmi** - React Hooks for Ethereum
- **viem** - 类型安全的以太坊库
- **RainbowKit** - 钱包连接 UI
- **ethers** - 以太坊库（可选）

## 功能特性

- ✅ 多链支持（Ethereum, Polygon, BSC, Arbitrum, Optimism 等）
- ✅ 钱包连接（MetaMask, WalletConnect 等）
- ✅ ETH 余额展示
- ✅ ERC20 代币余额展示
- ✅ ETH 转账功能
- ✅ ERC20 代币转账功能
- ✅ ERC20 代币授权功能

## 开始使用

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
.
├── app/                 # Next.js App Router
│   ├── layout.tsx      # 根布局
│   └── page.tsx        # 首页
├── components/         # React 组件
│   ├── WalletConnect.tsx
│   ├── AssetList.tsx
│   ├── TransferModal.tsx
│   └── ApproveModal.tsx
├── config/            # 配置文件
│   └── chains.ts      # 多链配置
├── hooks/             # 自定义 Hooks
│   └── useAssets.ts   # 资产相关 Hook
├── lib/               # 工具库
│   └── wagmi.ts       # wagmi 配置
└── types/             # TypeScript 类型定义
```


