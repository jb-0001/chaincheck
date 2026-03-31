import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBase58Check } from "../utils/base58.js";

const DOGE_P2PKH_REGEX = /^D[5-9A-HJ-NP-U][a-km-zA-HJ-NP-Z1-9]{32}$/;
const DOGE_P2SH_REGEX = /^A[a-km-zA-HJ-NP-Z1-9]{33}$/;

export function validateDogecoin(
  address: string,
  chain: "dogecoin",
  ticker: string,
  _options: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  if (!DOGE_P2PKH_REGEX.test(address) && !DOGE_P2SH_REGEX.test(address)) {
    return fail("Invalid Dogecoin address format");
  }

  const decoded = decodeBase58Check(address);
  if (!decoded) {
    return fail("Invalid Dogecoin address checksum");
  }

  if (decoded.version === 0x1e) {
    return { valid: true, chain, ticker, addressType: "p2pkh" };
  }
  if (decoded.version === 0x16) {
    return { valid: true, chain, ticker, addressType: "p2sh" };
  }

  return fail(`Invalid Dogecoin address version byte: 0x${decoded.version.toString(16).padStart(2, "0")}`);
}
