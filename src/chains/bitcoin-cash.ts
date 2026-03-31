import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBase58Check } from "../utils/base58.js";
import { decodeCashAddr } from "../utils/cashaddr.js";

export function validateBitcoinCash(
  address: string,
  chain: "bitcoinCash",
  ticker: string,
  options: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  // ── CashAddr ─────────────────────────────────────────────────────────────
  const cashAddr = decodeCashAddr(address);
  if (cashAddr !== null) {
    return {
      valid: true,
      chain,
      ticker,
      addressType: "cashaddr",
    };
  }

  // ── Legacy Base58Check ────────────────────────────────────────────────────
  if (options.requireCashAddr) {
    return fail("Legacy Base58Check addresses are not accepted when requireCashAddr is enabled");
  }

  const decoded = decodeBase58Check(address);
  if (decoded !== null) {
    if (decoded.version === 0x00) {
      return { valid: true, chain, ticker, addressType: "p2pkh" };
    }
    if (decoded.version === 0x05) {
      return { valid: true, chain, ticker, addressType: "p2sh" };
    }
    return fail("Invalid Bitcoin Cash legacy address version byte");
  }

  return fail("Invalid Bitcoin Cash address: does not match CashAddr or legacy Base58Check format");
}
