import type { ChainName, ValidationResult, ValidateOptions } from "./types.js";
import { getChainForTicker } from "./tickers.js";
import { validateBitcoin } from "./chains/bitcoin.js";
import { validateBitcoinCash } from "./chains/bitcoin-cash.js";
import { validateLitecoin } from "./chains/litecoin.js";
import { validateDogecoin } from "./chains/dogecoin.js";
import { validateEvm } from "./chains/evm.js";
import { validateTron } from "./chains/tron.js";
import { validateSolana } from "./chains/solana.js";
import { validateMonero } from "./chains/monero.js";
import { validateRipple } from "./chains/ripple.js";
import { validateZcash } from "./chains/zcash.js";
import { validateCardano } from "./chains/cardano.js";
import { validateAvalanche } from "./chains/avalanche.js";
import { validateNear } from "./chains/near.js";
import { validateAptos } from "./chains/aptos.js";
import { decodeBase58 } from "./utils/base58.js";

const SOLANA_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Validate a cryptocurrency address for the given ticker or chain name.
 * This is async to support `strictSolana` (Ed25519 on-curve check via dynamic import).
 * For synchronous usage without strictSolana, use `validateSync`.
 */
export async function validate(
  address: string,
  tickerOrChain: string,
  options?: ValidateOptions
): Promise<ValidationResult> {
  const opts: ValidateOptions = options ?? {};
  const ticker = tickerOrChain.toLowerCase();
  const chain = getChainForTicker(ticker);

  if (!chain) {
    return {
      valid: false,
      chain: "bitcoin",
      ticker,
      error: `Unknown ticker or chain: "${tickerOrChain}"`,
    };
  }

  return dispatch(address, chain, ticker, opts);
}

/**
 * Synchronous address validation. Equivalent to `validate()` for all chains
 * except Solana with `strictSolana: true` (that path requires async Ed25519 check).
 * If called with `strictSolana: true` on a Solana address, it will throw an error.
 */
export function validateSync(
  address: string,
  tickerOrChain: string,
  options?: ValidateOptions
): ValidationResult {
  const opts: ValidateOptions = options ?? {};
  const ticker = tickerOrChain.toLowerCase();
  const chain = getChainForTicker(ticker);

  if (!chain) {
    return {
      valid: false,
      chain: "bitcoin",
      ticker,
      error: `Unknown ticker or chain: "${tickerOrChain}"`,
    };
  }

  if (chain === "solana") {
    if (opts.strictSolana) {
      throw new Error("strictSolana requires async validation — use validate() instead of validateSync()");
    }
    return validateSolanaSync(address, chain, ticker);
  }

  return dispatchSync(address, chain, ticker, opts);
}

function validateSolanaSync(
  address: string,
  chain: "solana",
  ticker: string
): ValidationResult {
  const fail = (error: string): ValidationResult => ({ valid: false, chain, ticker, error });

  if (!SOLANA_REGEX.test(address)) {
    return fail("Invalid Solana address format: must be 32–44 Base58 characters");
  }

  const decoded = decodeBase58(address);
  if (!decoded || decoded.length !== 32) {
    return fail("Invalid Solana address: must decode to exactly 32 bytes");
  }

  return { valid: true, chain, ticker, addressType: "base58" };
}

function dispatchSync(
  address: string,
  chain: Exclude<ChainName, "solana">,
  ticker: string,
  opts: ValidateOptions
): ValidationResult {
  switch (chain) {
    case "bitcoin":
      return validateBitcoin(address, chain, ticker, opts);
    case "bitcoinCash":
      return validateBitcoinCash(address, chain, ticker, opts);
    case "litecoin":
      return validateLitecoin(address, chain, ticker, opts);
    case "dogecoin":
      return validateDogecoin(address, chain, ticker, opts);
    case "evm":
      return validateEvm(address, chain, ticker, opts);
    case "tron":
      return validateTron(address, chain, ticker, opts);
    case "monero":
      return validateMonero(address, chain, ticker, opts);
    case "ripple":
      return validateRipple(address, chain, ticker, opts);
    case "zcash":
      return validateZcash(address, chain, ticker, opts);
    case "cardano":
      return validateCardano(address, chain, ticker, opts);
    case "avalanche":
      return validateAvalanche(address, chain, ticker, opts);
    case "near":
      return validateNear(address, chain, ticker, opts);
    case "aptos":
      return validateAptos(address, chain, ticker, opts);
  }
}

function dispatch(
  address: string,
  chain: ChainName,
  ticker: string,
  opts: ValidateOptions
): Promise<ValidationResult> | ValidationResult {
  if (chain === "solana") {
    return validateSolana(address, chain, ticker, opts);
  }
  return dispatchSync(address, chain as Exclude<ChainName, "solana">, ticker, opts);
}
