import type { ValidationResult, ValidateOptions } from "../types.js";

// Implicit accounts: exactly 64 lowercase hex characters (a 32-byte Ed25519 public key)
const IMPLICIT_REGEX = /^[0-9a-f]{64}$/;

// Named account rules:
//   - 2–64 characters total
//   - Segments separated by dots; each segment contains a-z, 0-9, _ or -
//   - Each segment must start and end with alphanumeric (a-z or 0-9)
//   - Single-char segments are allowed (just one alphanumeric)
const NAMED_SEGMENT = "[a-z\\d]([a-z\\d_-]{0,61}[a-z\\d])?";
const NAMED_REGEX = new RegExp(
  `^(${NAMED_SEGMENT}\\.)*${NAMED_SEGMENT}$`
);

export function validateNear(
  address: string,
  chain: "near",
  ticker: string,
  _opts: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  if (address.length === 0) {
    return fail("Invalid NEAR address: empty string");
  }

  // Implicit account: 64 lowercase hex chars
  if (IMPLICIT_REGEX.test(address)) {
    return { valid: true, chain, ticker, addressType: "implicit" };
  }

  // Named account: 2–64 chars
  if (address.length >= 2 && address.length <= 64 && NAMED_REGEX.test(address)) {
    return { valid: true, chain, ticker, addressType: "named" };
  }

  return fail(
    "Invalid NEAR address: must be a 64-char hex implicit account or a valid named account (a-z, 0-9, _, -)"
  );
}
