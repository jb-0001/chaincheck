import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBase58Check } from "../utils/base58.js";

const TRON_REGEX = /^T[a-km-zA-HJ-NP-Z1-9]{33}$/;

export function validateTron(
  address: string,
  chain: "tron",
  ticker: string,
  _options: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  if (!TRON_REGEX.test(address)) {
    return fail("Invalid Tron address format: must start with T and be 34 characters");
  }

  const decoded = decodeBase58Check(address);
  if (!decoded) {
    return fail("Invalid Tron address checksum");
  }

  if (decoded.version !== 0x41) {
    return fail(`Invalid Tron address version byte: expected 0x41, got 0x${decoded.version.toString(16).padStart(2, "0")}`);
  }

  return { valid: true, chain, ticker, addressType: "base58" };
}
