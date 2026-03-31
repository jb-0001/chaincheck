import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBech32, convertBits } from "../utils/bech32.js";
import { decodeBase58 } from "../utils/base58.js";

// Cardano Shelley bech32 addresses exceed BIP-173's 90-char limit (~103 chars for base addresses)
const CARDANO_MAX_BECH32_LEN = 150;

// Shelley address minimum decoded size:
// smallest type (enterprise/reward) = 1 header + 28 credential = 29 bytes
const SHELLEY_MIN_BYTES = 29;

// Byron addresses are CBOR-encoded Base58. The outer CBOR structure is a
// 2-element array (tag 0x82) or occasionally a tagged item. Decoded lengths
// vary but are always > 50 bytes. We accept 57–130 bytes as valid range.
const BYRON_MIN_BYTES = 57;
const BYRON_MAX_BYTES = 130;

export function validateCardano(
  address: string,
  chain: "cardano",
  ticker: string,
  opts: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  // ── Shelley address (bech32 with "addr" or "addr_test" HRP) ───────────────
  const bech = decodeBech32(address, { maxLength: CARDANO_MAX_BECH32_LEN });
  if (bech !== null) {
    const { hrp } = bech;
    if (hrp === "addr") {
      const data = convertBits(bech.words, 5, 8, false);
      if (!data || data.length < SHELLEY_MIN_BYTES) {
        return fail("Invalid Cardano Shelley address: payload too short");
      }
      return { valid: true, chain, ticker, addressType: "shelley" };
    }
    if (hrp === "addr_test") {
      if (!opts.testnet) {
        return fail("Invalid Cardano address: testnet address requires testnet option");
      }
      const data = convertBits(bech.words, 5, 8, false);
      if (!data || data.length < SHELLEY_MIN_BYTES) {
        return fail("Invalid Cardano Shelley testnet address: payload too short");
      }
      return { valid: true, chain, ticker, addressType: "shelley" };
    }
    return fail(`Invalid Cardano address: unexpected bech32 HRP "${hrp}"`);
  }

  // ── Byron address (Base58-encoded CBOR) ───────────────────────────────────
  const decoded = decodeBase58(address);
  if (decoded && decoded.length >= BYRON_MIN_BYTES && decoded.length <= BYRON_MAX_BYTES) {
    // CBOR outer array starts with 0x82 (2-item array) or 0x83 (3-item array)
    if (decoded[0] === 0x82 || decoded[0] === 0x83) {
      return { valid: true, chain, ticker, addressType: "base58" };
    }
  }

  return fail(
    "Invalid Cardano address: must be a Shelley bech32 (addr1…) or Byron Base58 address"
  );
}
