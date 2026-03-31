import type { ValidationResult, ValidateOptions } from "../types.js";
import { keccak256 } from "../utils/hash.js";

const EVM_REGEX = /^0x[0-9a-fA-F]{40}$/;

export function validateEvm(
  address: string,
  chain: "evm",
  ticker: string,
  _options: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  if (!EVM_REGEX.test(address)) {
    return fail("Invalid EVM address format: must be 0x followed by 40 hex characters");
  }

  const hex = address.slice(2);
  const isAllLower = hex === hex.toLowerCase();
  const isAllUpper = hex === hex.toUpperCase();

  // All-lowercase or all-uppercase: valid without checksum
  if (isAllLower || isAllUpper) {
    return { valid: true, chain, ticker, addressType: "hex" };
  }

  // Mixed case: verify EIP-55 checksum
  const lower = hex.toLowerCase();
  const hash = keccak256(new TextEncoder().encode(lower));

  for (let i = 0; i < 40; i++) {
    const nibble = (hash[Math.floor(i / 2)]! >> (i % 2 === 0 ? 4 : 0)) & 0x0f;
    const char = hex[i]!;
    if (nibble >= 8) {
      if (char !== char.toUpperCase()) {
        return fail("Invalid EIP-55 checksum");
      }
    } else {
      if (char !== char.toLowerCase()) {
        return fail("Invalid EIP-55 checksum");
      }
    }
  }

  return { valid: true, chain, ticker, addressType: "eip55" };
}
