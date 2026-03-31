# chaincheck

Validate cryptocurrency and blockchain addresses offline. Bitcoin, Ethereum, Solana, Monero, XRP, Cardano, Avalanche, NEAR, Aptos, Zcash, Tron and more. Regex pre-checks plus cryptographic checksum verification. 108 tickers, 14 chain families. No address generation, no key handling, no on-chain calls.

[![npm](https://img.shields.io/npm/v/chaincheck)](https://www.npmjs.com/package/chaincheck)
[![bundle size](https://img.shields.io/badge/gzip-~6_KB-blue)](https://bundlephobia.com/package/chaincheck)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

- **Format + integrity validation** — regex fast-path, then checksum/encoding verification
- **108 tickers, 14 chain families** — Bitcoin, EVM networks, Tron, Solana, Litecoin, Dogecoin, Bitcoin Cash, Monero, Ripple, Zcash, Cardano, Avalanche, NEAR, Aptos
- **TypeScript-first** — full type exports, strict mode
- **Dual ESM + CJS** — tree-shakeable, works in Node.js ≥ 18
- **No network calls** — pure offline validation

## Install

```sh
npm install chaincheck
```

Optional: for Solana Ed25519 on-curve checking (`strictSolana` mode):

```sh
npm install @noble/curves
```

## Quick start

```ts
import { validate, validateSync } from "chaincheck";

// Async (supports strictSolana)
const result = await validate("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "eth");
// { valid: true, chain: "evm", ticker: "eth", addressType: "eip55" }

// Synchronous (all chains except strictSolana)
const result = validateSync("TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW", "trc20/usdt");
// { valid: true, chain: "tron", ticker: "trc20/usdt", addressType: "base58" }

// Monero
validateSync("44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A", "xmr");
// { valid: true, chain: "monero", addressType: "monero-standard" }

// NEAR
validateSync("alice.near", "near");
// { valid: true, chain: "near", addressType: "named" }

// Invalid address
const result = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046", "eth");
// { valid: false, chain: "evm", ticker: "eth", error: "Invalid EIP-55 checksum" }
```

## API

### `validate(address, tickerOrChain, options?)`

Validates an address asynchronously. Required for `strictSolana: true`.

```ts
const result = await validate(address, tickerOrChain, options);
```

### `validateSync(address, tickerOrChain, options?)`

Validates an address synchronously. Throws if called with `strictSolana: true` — use `validate()` instead.

```ts
const result = validateSync(address, tickerOrChain, options);
```

Both functions accept a **ticker** (e.g. `"btc"`, `"erc20/usdt"`, `"xmr"`) or a **chain name** (e.g. `"bitcoin"`, `"evm"`, `"monero"`).

### `ValidationResult`

```ts
interface ValidationResult {
  valid: boolean;
  chain: ChainName;       // "bitcoin" | "evm" | "monero" | "ripple" | ...
  ticker: string;         // the ticker/chain you passed in
  addressType?: string;   // see address types below
  error?: string;         // human-readable reason when valid is false
}
```

**Address types:**

| Value | Used by |
|---|---|
| `"p2pkh"` | Bitcoin legacy, Zcash t1, Litecoin, Dogecoin, Tron |
| `"p2sh"` | Bitcoin P2SH, Zcash t3, Litecoin |
| `"bech32"` | Bitcoin SegWit, Litecoin, Avalanche X/P-chain |
| `"bech32m"` | Bitcoin Taproot |
| `"cashaddr"` | Bitcoin Cash |
| `"eip55"` | EVM (mixed-case checksum) |
| `"hex"` | EVM (all lowercase/uppercase), Aptos |
| `"base58"` | Tron, Solana, Ripple, Cardano Byron |
| `"sapling"` | Zcash shielded (Sapling, `zs1…`) |
| `"shelley"` | Cardano Shelley (`addr1…`) |
| `"monero-standard"` | Monero standard address (starts with `4`) |
| `"monero-subaddress"` | Monero subaddress (starts with `8`) |
| `"monero-integrated"` | Monero integrated address (106 chars) |
| `"implicit"` | NEAR implicit account (64 hex chars) |
| `"named"` | NEAR named account (`alice.near`) |

### `ValidateOptions`

```ts
interface ValidateOptions {
  strictSolana?: boolean;    // verify Ed25519 on-curve (requires @noble/curves). Default: false
  testnet?: boolean;         // accept testnet addresses (Monero, Cardano, Avalanche). Default: false
  requireCashAddr?: boolean; // BCH only: reject legacy Base58Check. Default: false
}
```

### Boolean helpers

```ts
import {
  isValidBitcoinAddress,
  isValidEvmAddress,
  isValidTronAddress,
  isValidSolanaAddress,
  isValidLitecoinAddress,
  isValidDogecoinAddress,
  isValidBitcoinCashAddress,
  isValidMoneroAddress,
  isValidRippleAddress,
  isValidZcashAddress,
  isValidCardanoAddress,
  isValidAvalancheAddress,
  isValidNearAddress,
  isValidAptosAddress,
} from "chaincheck";

isValidEvmAddress("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"); // true
isValidMoneroAddress("44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A"); // true
isValidNearAddress("alice.near"); // true
isValidAptosAddress("0x1"); // true
```

### Ticker utilities

```ts
import { getChainForTicker, getSupportedTickers } from "chaincheck";

getChainForTicker("erc20/usdt");  // "evm"
getChainForTicker("trc20/usdt");  // "tron"
getChainForTicker("xmr");         // "monero"
getChainForTicker("xrp");         // "ripple"
getChainForTicker("ada");         // "cardano"
getChainForTicker("bep20/ltc");   // "evm"  ← token on BSC, not Litecoin

getSupportedTickers(); // 108 tickers
```

## Supported chains & address formats

| Chain | Ticker examples | Address formats | Checksum |
|---|---|---|---|
| **Bitcoin** | `btc` | P2PKH (`1…`), P2SH (`3…`), Bech32 (`bc1q…`), Bech32m/Taproot (`bc1p…`) | SHA-256d, BCH polynomial |
| **Bitcoin Cash** | `bch` | CashAddr (`bitcoincash:q…`), legacy P2PKH/P2SH | CashAddr polymod, SHA-256d |
| **Litecoin** | `ltc` | P2PKH (`L…`), P2SH-SegWit (`M…`), legacy P2SH (`3…`), Bech32 (`ltc1…`) | SHA-256d, BCH polynomial |
| **Dogecoin** | `doge` | P2PKH (`D…`), P2SH (`A…`) | SHA-256d |
| **EVM** | `eth`, `bnb`, `matic`, `pol`, `arb`, `op`, `mon`, `erc20/*`, `bep20/*`, `arbitrum/*`, `polygon/*`, `avax-c/*`, `base/*`, `optimism/*`, `linea/*`, `monad/*`, `unichain/*` | Hex (`0x` + 20 bytes) | EIP-55 mixed-case |
| **Tron** | `trx`, `trc20/*` | Base58Check (`T…`) | SHA-256d (version `0x41`) |
| **Solana** | `sol/*` | Base58 (32 bytes) | Length + alphabet; opt-in Ed25519 |
| **Monero** | `xmr` | Standard (`4…`, 95 chars), subaddress (`8…`, 95 chars), integrated (106 chars) | Keccak-256 |
| **Ripple** | `xrp` | Base58Check with XRP alphabet (`r…`, 25–34 chars) | SHA-256d |
| **Zcash** | `zec` | Transparent P2PKH (`t1…`), P2SH (`t3…`), Sapling shielded (`zs1…`) | SHA-256d, BCH polynomial |
| **Cardano** | `ada` | Shelley bech32 (`addr1…`), Byron Base58 | BCH polynomial, CBOR |
| **Avalanche** | `avax` | C-Chain EVM (`0x…`), X-Chain (`X-avax1…`), P-Chain (`P-avax1…`) | EIP-55, BCH polynomial |
| **NEAR** | `near` | Implicit (64 hex chars), named account (`alice.near`) | — |
| **Aptos** | `apt` | Hex (`0x` + 1–64 hex chars) | — |

### All supported tickers

<details>
<summary>Show all 108 tickers</summary>

**Bitcoin:** `btc`

**Bitcoin Cash:** `bch`

**Litecoin:** `ltc`

**Dogecoin:** `doge`

**EVM (Ethereum & L2s):**
`eth`, `bnb`, `matic`, `pol`, `arb`, `op`, `mon`,
`erc20/1inch`, `erc20/arb`, `erc20/bnb`, `erc20/cbbtc`, `erc20/dai`, `erc20/link`, `erc20/ondo`, `erc20/pepe`, `erc20/pol`, `erc20/pyusd`, `erc20/shib`, `erc20/usd1`, `erc20/usdc`, `erc20/usdt`, `erc20/wxrp`,
`bep20/1inch`, `bep20/ada`, `bep20/bnb`, `bep20/btcb`, `bep20/cake`, `bep20/dai`, `bep20/doge`, `bep20/eth`, `bep20/ltc`, `bep20/phpt`, `bep20/shib`, `bep20/usd1`, `bep20/usdc`, `bep20/usdt`, `bep20/xrp`,
`arbitrum/arb`, `arbitrum/dai`, `arbitrum/eth`, `arbitrum/link`, `arbitrum/pepe`, `arbitrum/pyusd`, `arbitrum/usdc`, `arbitrum/usdc.e`, `arbitrum/usdt0`,
`polygon/avax`, `polygon/pol`, `polygon/usdc`, `polygon/usdc.e`, `polygon/usdt`, `polygon/weth`,
`avax-c/avax`, `avax-c/usdc`, `avax-c/usdc.e`, `avax-c/usdt`, `avax-c/wavax`, `avax-c/weth.e`,
`base/cbbtc`, `base/dai`, `base/eth`, `base/usdc`, `base/usdt`,
`optimism/dai`, `optimism/eth`, `optimism/link`, `optimism/op`, `optimism/usdc`, `optimism/usdc.e`, `optimism/usdt`, `optimism/usdt0`,
`linea/eth`, `linea/usdc`, `linea/usdt`,
`monad/mon`, `monad/usdc`, `monad/usdt0`,
`unichain/eth`, `unichain/uni`, `unichain/usdc`, `unichain/usdt`

**Tron:** `trx`, `trc20/btc`, `trc20/inrt`, `trc20/tusd`, `trc20/usdd`, `trc20/usdt`

**Solana:** `sol/cbbtc`, `sol/eurc`, `sol/hnt`, `sol/pyusd`, `sol/sol`, `sol/trump`, `sol/usdc`, `sol/usdt`, `sol/wbtc`, `sol/weth`

**Monero:** `xmr`

**Ripple:** `xrp`

**Zcash:** `zec`

**Cardano:** `ada`

**Avalanche:** `avax`

**NEAR:** `near`

**Aptos:** `apt`

</details>

## Usage examples

### Validate a deposit address before processing

```ts
import { validateSync } from "chaincheck";

function acceptDeposit(address: string, ticker: string) {
  const result = validateSync(address, ticker);
  if (!result.valid) {
    throw new Error(`Invalid ${ticker} address: ${result.error}`);
  }
  // proceed with deposit...
}
```

### Check an EVM address with EIP-55 checksum enforcement

```ts
import { validateSync } from "chaincheck";

// Mixed-case: verified against EIP-55 checksum
validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "eth");
// → { valid: true, addressType: "eip55" }

// All-lowercase: accepted without checksum
validateSync("0xd8da6bf26964af9d7eed9e03e53415d37aa96045", "eth");
// → { valid: true, addressType: "hex" }

// Wrong checksum: rejected
validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046", "eth");
// → { valid: false, error: "Invalid EIP-55 checksum" }
```

### Monero address types

```ts
import { validateSync } from "chaincheck";

// Standard address (starts with 4, 95 chars)
validateSync("44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A", "xmr");
// → { valid: true, addressType: "monero-standard" }

// Subaddress (starts with 8, 95 chars)
validateSync("8AfV2RS5...", "xmr");
// → { valid: true, addressType: "monero-subaddress" }

// Integrated address (starts with 4, 106 chars — contains embedded payment ID)
validateSync("4LL9o...", "xmr");
// → { valid: true, addressType: "monero-integrated" }
```

### Avalanche multi-chain

```ts
import { validateSync } from "chaincheck";

// C-Chain (EVM-compatible)
validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "avax");
// → { valid: true, chain: "avalanche", addressType: "eip55" }

// X-Chain (bech32, asset transfers)
validateSync("X-avax1zg69v7y6hn00qyfzxdz92enh3zv64w7vanlrwv", "avax");
// → { valid: true, chain: "avalanche", addressType: "bech32" }

// P-Chain (bech32, staking)
validateSync("P-avax1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxpdk7q", "avax");
// → { valid: true, chain: "avalanche", addressType: "bech32" }
```

### NEAR Protocol

```ts
import { validateSync } from "chaincheck";

// Named account
validateSync("alice.near", "near");
// → { valid: true, addressType: "named" }

// Sub-account
validateSync("app.alice.near", "near");
// → { valid: true, addressType: "named" }

// Implicit account (64 hex chars — Ed25519 public key)
validateSync("98793cd91a3f870fb126f66285808c7e094afcfc4eda8a970f6648cdf0dbd6de", "near");
// → { valid: true, addressType: "implicit" }
```

### Cardano — Shelley vs Byron

```ts
import { validateSync } from "chaincheck";

// Shelley address (bech32, current era)
validateSync("addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8", "ada");
// → { valid: true, addressType: "shelley" }

// Testnet address (requires testnet option)
validateSync("addr_test1wyqqq...", "ada", { testnet: true });
// → { valid: true, addressType: "shelley" }
```

### Bitcoin Cash — CashAddr vs legacy

```ts
import { validateSync } from "chaincheck";

// CashAddr (recommended)
validateSync("bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a", "bch");
// → { valid: true, addressType: "cashaddr" }

// Legacy addresses accepted by default...
validateSync("1BgGZ9tcN4s5FVrTU9ZVhafwwnwo7ugEv8", "bch");
// → { valid: true, addressType: "p2pkh" }

// ...but can be rejected with requireCashAddr
validateSync("1BgGZ9tcN4s5FVrTU9ZVhafwwnwo7ugEv8", "bch", { requireCashAddr: true });
// → { valid: false, error: "Legacy Base58Check addresses are not accepted when requireCashAddr is enabled" }
```

### Solana strict mode (Ed25519 on-curve)

```ts
import { validate } from "chaincheck";

// Default: length + Base58 only (fast, works for wallets)
await validate("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "sol/usdc");
// → { valid: true, addressType: "base58" }

// Strict: also verifies the 32 bytes are a valid Ed25519 point
// Program Derived Addresses (PDAs) will fail strict mode — this is expected
// Requires: npm install @noble/curves
await validate("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "sol/usdc", { strictSolana: true });
```

## Validation logic

Each chain performs two checks:

1. **Regex** — fast structural pre-check (length, prefix, character set)
2. **Checksum** — cryptographic integrity verification

| Chain | Checksum algorithm |
|---|---|
| Bitcoin (legacy/P2SH), Litecoin, Dogecoin, Tron, Ripple, Zcash (transparent) | SHA-256 double-hash |
| Bitcoin (SegWit/Taproot), Litecoin (bech32), Cardano (Shelley), Avalanche (X/P-chain), Zcash (Sapling) | BCH polynomial (BIP-173/BIP-350) |
| Bitcoin Cash CashAddr | CashAddr polymod |
| EVM, Avalanche C-Chain | keccak-256 (EIP-55, mixed-case only) |
| Monero | keccak-256 (first 4 bytes) |
| Solana | None by default; Ed25519 curve check opt-in |
| NEAR, Aptos | Format/length check only |

## Non-goals

- **No on-chain validation** — does not check balances, contract existence, or whether an address has ever been used
- **No address generation** — does not create addresses or handle private keys

## Requirements

- Node.js ≥ 18
- One hard dependency: [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) (audited, zero-dependency, for keccak-256)
- Optional peer dependency: [`@noble/curves`](https://github.com/paulmillr/noble-curves) (for `strictSolana`)

## License

MIT
