import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBase58WithAlphabet } from "../utils/base58.js";
import { sha256d } from "../utils/hash.js";

// XRP uses a custom Base58 alphabet (different from Bitcoin's)
const XRP_ALPHABET = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz";

// XRP addresses: 25–34 chars, always start with 'r'
// Valid characters come from the XRP alphabet; the set is identical to
// [rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]
const XRP_REGEX = /^r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{24,33}$/;

export function validateRipple(
  address: string,
  chain: "ripple",
  ticker: string,
  _opts: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  if (!XRP_REGEX.test(address)) {
    return fail(
      "Invalid XRP address format: must start with 'r' and be 25–34 characters in XRP Base58 alphabet"
    );
  }

  const decoded = decodeBase58WithAlphabet(address, XRP_ALPHABET);
  // Encoded 34 chars with XRP alphabet → 25 bytes (1 version + 20 payload + 4 checksum)
  if (!decoded || decoded.length !== 25) {
    return fail("Invalid XRP address: incorrect decoded byte length");
  }

  // Verify SHA-256d checksum (last 4 bytes)
  const body = decoded.slice(0, 21);
  const checksum = decoded.slice(21);
  const expected = sha256d(body);

  if (
    checksum[0] !== expected[0] ||
    checksum[1] !== expected[1] ||
    checksum[2] !== expected[2] ||
    checksum[3] !== expected[3]
  ) {
    return fail("Invalid XRP address: checksum mismatch");
  }

  // Version byte must be 0x00
  if (decoded[0] !== 0x00) {
    return fail("Invalid XRP address: unexpected version byte");
  }

  return { valid: true, chain, ticker, addressType: "base58" };
}
