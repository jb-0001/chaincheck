import type { ChainName } from "./types.js";

export const CHAIN_NAMES = new Set<ChainName>([
  "bitcoin",
  "bitcoinCash",
  "litecoin",
  "dogecoin",
  "evm",
  "tron",
  "solana",
  "monero",
  "ripple",
  "zcash",
  "cardano",
  "avalanche",
  "near",
  "aptos",
]);

/** Maps every supported ticker (and chain name) to its validation chain family. */
export const TICKER_MAP: Record<string, ChainName> = {
  // ── Bitcoin ────────────────────────────────────────────────────────────────
  btc: "bitcoin",

  // ── Bitcoin Cash ───────────────────────────────────────────────────────────
  bch: "bitcoinCash",

  // ── Litecoin ───────────────────────────────────────────────────────────────
  ltc: "litecoin",
  // bep20/ltc is a BEP-20 token on BSC — EVM address, not Litecoin
  "bep20/ltc": "evm",

  // ── Dogecoin ───────────────────────────────────────────────────────────────
  doge: "dogecoin",

  // ── EVM: Ethereum mainnet ──────────────────────────────────────────────────
  eth: "evm",

  // ── EVM: ERC-20 tokens ────────────────────────────────────────────────────
  "erc20/1inch": "evm",
  "erc20/arb": "evm",
  "erc20/bnb": "evm",
  "erc20/cbbtc": "evm",
  "erc20/dai": "evm",
  "erc20/link": "evm",
  "erc20/ondo": "evm",
  "erc20/pepe": "evm",
  "erc20/pol": "evm",
  "erc20/pyusd": "evm",
  "erc20/shib": "evm",
  "erc20/usd1": "evm",
  "erc20/usdc": "evm",
  "erc20/usdt": "evm",
  "erc20/wxrp": "evm",

  // ── EVM: BEP-20 tokens (BSC) ──────────────────────────────────────────────
  "bep20/1inch": "evm",
  "bep20/ada": "evm",
  "bep20/bnb": "evm",
  "bep20/btcb": "evm",
  "bep20/cake": "evm",
  "bep20/dai": "evm",
  "bep20/doge": "evm",
  "bep20/eth": "evm",
  "bep20/phpt": "evm",
  "bep20/shib": "evm",
  "bep20/usd1": "evm",
  "bep20/usdc": "evm",
  "bep20/usdt": "evm",
  "bep20/xrp": "evm",

  // ── EVM: Arbitrum ─────────────────────────────────────────────────────────
  "arbitrum/arb": "evm",
  "arbitrum/dai": "evm",
  "arbitrum/eth": "evm",
  "arbitrum/link": "evm",
  "arbitrum/pepe": "evm",
  "arbitrum/pyusd": "evm",
  "arbitrum/usdc": "evm",
  "arbitrum/usdc.e": "evm",
  "arbitrum/usdt0": "evm",

  // ── EVM: Polygon ──────────────────────────────────────────────────────────
  "polygon/avax": "evm",
  "polygon/pol": "evm",
  "polygon/usdc": "evm",
  "polygon/usdc.e": "evm",
  "polygon/usdt": "evm",
  "polygon/weth": "evm",

  // ── EVM: Avalanche C-Chain ────────────────────────────────────────────────
  "avax-c/avax": "evm",
  "avax-c/usdc": "evm",
  "avax-c/usdc.e": "evm",
  "avax-c/usdt": "evm",
  "avax-c/wavax": "evm",
  "avax-c/weth.e": "evm",

  // ── EVM: Base ─────────────────────────────────────────────────────────────
  "base/cbbtc": "evm",
  "base/dai": "evm",
  "base/eth": "evm",
  "base/usdc": "evm",
  "base/usdt": "evm",

  // ── EVM: Optimism ─────────────────────────────────────────────────────────
  "optimism/dai": "evm",
  "optimism/eth": "evm",
  "optimism/link": "evm",
  "optimism/op": "evm",
  "optimism/usdc": "evm",
  "optimism/usdc.e": "evm",
  "optimism/usdt": "evm",
  "optimism/usdt0": "evm",

  // ── EVM: Linea ────────────────────────────────────────────────────────────
  "linea/eth": "evm",
  "linea/usdc": "evm",
  "linea/usdt": "evm",

  // ── EVM: Monad ────────────────────────────────────────────────────────────
  "monad/mon": "evm",
  "monad/usdc": "evm",
  "monad/usdt0": "evm",

  // ── EVM: BNB Smart Chain (BSC) native ────────────────────────────────────
  bnb: "evm",

  // ── EVM: Polygon ──────────────────────────────────────────────────────────
  matic: "evm",
  pol: "evm",

  // ── EVM: Arbitrum One ─────────────────────────────────────────────────────
  arb: "evm",

  // ── EVM: Optimism ─────────────────────────────────────────────────────────
  op: "evm",

  // ── EVM: Monad ────────────────────────────────────────────────────────────
  mon: "evm",

  // ── EVM: Unichain ─────────────────────────────────────────────────────────
  "unichain/eth": "evm",
  "unichain/uni": "evm",
  "unichain/usdc": "evm",
  "unichain/usdt": "evm",

  // ── Monero ─────────────────────────────────────────────────────────────────
  xmr: "monero",

  // ── Ripple (XRP) ───────────────────────────────────────────────────────────
  xrp: "ripple",

  // ── Zcash ──────────────────────────────────────────────────────────────────
  zec: "zcash",

  // ── Cardano ────────────────────────────────────────────────────────────────
  ada: "cardano",

  // ── Avalanche ──────────────────────────────────────────────────────────────
  avax: "avalanche",

  // ── NEAR Protocol ──────────────────────────────────────────────────────────
  near: "near",

  // ── Aptos ──────────────────────────────────────────────────────────────────
  apt: "aptos",

  // ── Tron ───────────────────────────────────────────────────────────────────
  trx: "tron",
  // trc20/btc is a TRC-20 token on Tron — Tron address, not Bitcoin
  "trc20/btc": "tron",
  "trc20/inrt": "tron",
  "trc20/tusd": "tron",
  "trc20/usdd": "tron",
  "trc20/usdt": "tron",

  // ── Solana ─────────────────────────────────────────────────────────────────
  "sol/cbbtc": "solana",
  "sol/eurc": "solana",
  "sol/hnt": "solana",
  "sol/pyusd": "solana",
  "sol/sol": "solana",
  "sol/trump": "solana",
  "sol/usdc": "solana",
  "sol/usdt": "solana",
  "sol/wbtc": "solana",
  "sol/weth": "solana",
};

export function getChainForTicker(ticker: string): ChainName | undefined {
  const lower = ticker.toLowerCase();
  // Direct ticker lookup
  if (lower in TICKER_MAP) return TICKER_MAP[lower];
  // Chain name passthrough
  if (CHAIN_NAMES.has(lower as ChainName)) return lower as ChainName;
  return undefined;
}

export function getSupportedTickers(): string[] {
  return Object.keys(TICKER_MAP);
}
