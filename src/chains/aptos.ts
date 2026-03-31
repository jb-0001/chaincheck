import type { ValidationResult, ValidateOptions } from "../types.js";

// Aptos addresses: 0x followed by 1–64 hex characters (a 32-byte value; leading zeros may be omitted)
const APTOS_REGEX = /^0x[0-9a-fA-F]{1,64}$/;

export function validateAptos(
  address: string,
  chain: "aptos",
  ticker: string,
  _opts: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  if (!APTOS_REGEX.test(address)) {
    return fail(
      "Invalid Aptos address: must be 0x followed by 1–64 hexadecimal characters"
    );
  }

  return { valid: true, chain, ticker, addressType: "hex" };
}
