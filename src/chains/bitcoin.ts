import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBase58Check } from "../utils/base58.js";
import { decodeBech32, convertBits } from "../utils/bech32.js";

export function validateBitcoin(
  address: string,
  chain: "bitcoin",
  ticker: string,
  _options: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  // ── Bech32 / Bech32m (SegWit) ────────────────────────────────────────────
  const bech = decodeBech32(address);
  if (bech !== null) {
    if (bech.hrp !== "bc") {
      return fail("Invalid HRP for Bitcoin: expected 'bc'");
    }
    if (bech.words.length < 1) {
      return fail("Bech32 witness program missing version byte");
    }

    const witnessVersion = bech.words[0]!;
    const program = convertBits(bech.words.slice(1), 5, 8, false);

    if (!program) {
      return fail("Invalid Bech32 witness program encoding");
    }

    // Witness version 0 must use Bech32; versions 1–16 must use Bech32m
    if (witnessVersion === 0 && bech.variant !== "bech32") {
      return fail("Witness v0 must use Bech32 encoding");
    }
    if (witnessVersion !== 0 && bech.variant !== "bech32m") {
      return fail("Witness v1+ must use Bech32m encoding");
    }

    if (witnessVersion > 16) {
      return fail("Invalid witness version");
    }

    // v0: program must be 20 (P2WPKH) or 32 (P2WSH) bytes
    if (witnessVersion === 0 && program.length !== 20 && program.length !== 32) {
      return fail("Invalid witness v0 program length");
    }

    // v1+ (Taproot and future): 2–40 bytes
    if (witnessVersion >= 1 && (program.length < 2 || program.length > 40)) {
      return fail("Invalid witness program length");
    }

    return {
      valid: true,
      chain,
      ticker,
      addressType: witnessVersion === 0 ? "bech32" : "bech32m",
    };
  }

  // ── Base58Check (Legacy P2PKH / P2SH) ────────────────────────────────────
  const decoded = decodeBase58Check(address);
  if (decoded !== null) {
    if (decoded.version === 0x00) {
      return { valid: true, chain, ticker, addressType: "p2pkh" };
    }
    if (decoded.version === 0x05) {
      return { valid: true, chain, ticker, addressType: "p2sh" };
    }
    return fail("Invalid Bitcoin address version byte");
  }

  return fail("Invalid Bitcoin address: does not match any known format");
}
