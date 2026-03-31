export type { ChainName, ValidationResult, ValidateOptions, AddressType } from "./types.js";
export { validate, validateSync } from "./validate.js";
export { getChainForTicker, getSupportedTickers } from "./tickers.js";

// ── Convenience boolean helpers ───────────────────────────────────────────────

import { validateSync } from "./validate.js";
import type { ValidateOptions } from "./types.js";

export function isValidBitcoinAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "bitcoin", options).valid;
}

export function isValidBitcoinCashAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "bitcoinCash", options).valid;
}

export function isValidLitecoinAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "litecoin", options).valid;
}

export function isValidDogecoinAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "dogecoin", options).valid;
}

export function isValidEvmAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "evm", options).valid;
}

export function isValidTronAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "tron", options).valid;
}

export function isValidSolanaAddress(address: string, options?: Omit<ValidateOptions, "strictSolana">): boolean {
  return validateSync(address, "solana", options).valid;
}

export function isValidMoneroAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "monero", options).valid;
}

export function isValidRippleAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "ripple", options).valid;
}

export function isValidZcashAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "zcash", options).valid;
}

export function isValidCardanoAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "cardano", options).valid;
}

export function isValidAvalancheAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "avalanche", options).valid;
}

export function isValidNearAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "near", options).valid;
}

export function isValidAptosAddress(address: string, options?: ValidateOptions): boolean {
  return validateSync(address, "aptos", options).valid;
}
