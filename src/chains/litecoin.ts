import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBase58Check } from "../utils/base58.js";
import { decodeBech32, convertBits } from "../utils/bech32.js";

export function validateLitecoin(
  address: string,
  chain: "litecoin",
  ticker: string,
  _options: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  // ── Bech32 (SegWit ltc1…) ────────────────────────────────────────────────
  const bech = decodeBech32(address);
  if (bech !== null) {
    if (bech.hrp !== "ltc") {
      return fail("Invalid HRP for Litecoin: expected 'ltc'");
    }
    if (bech.words.length < 1) {
      return fail("Bech32 witness program missing version byte");
    }

    const witnessVersion = bech.words[0]!;
    const program = convertBits(bech.words.slice(1), 5, 8, false);

    if (!program) {
      return fail("Invalid Bech32 witness program encoding");
    }

    if (witnessVersion === 0 && bech.variant !== "bech32") {
      return fail("Witness v0 must use Bech32 encoding");
    }
    if (witnessVersion !== 0 && bech.variant !== "bech32m") {
      return fail("Witness v1+ must use Bech32m encoding");
    }
    if (witnessVersion > 16) {
      return fail("Invalid witness version");
    }
    if (witnessVersion === 0 && program.length !== 20 && program.length !== 32) {
      return fail("Invalid witness v0 program length");
    }
    if (witnessVersion >= 1 && (program.length < 2 || program.length > 40)) {
      return fail("Invalid witness program length");
    }

    return { valid: true, chain, ticker, addressType: "bech32" };
  }

  // ── Base58Check ──────────────────────────────────────────────────────────
  const decoded = decodeBase58Check(address);
  if (decoded !== null) {
    // 0x30 = L-prefix (P2PKH)
    if (decoded.version === 0x30) {
      return { valid: true, chain, ticker, addressType: "p2pkh" };
    }
    // 0x32 = M-prefix (P2SH-SegWit)
    if (decoded.version === 0x32) {
      return { valid: true, chain, ticker, addressType: "p2sh" };
    }
    // 0x05 = legacy 3-prefix P2SH (also used by Bitcoin — only valid here with ltc ticker context)
    if (decoded.version === 0x05) {
      return { valid: true, chain, ticker, addressType: "p2sh" };
    }
    return fail("Invalid Litecoin address version byte");
  }

  return fail("Invalid Litecoin address: does not match any known format");
}
