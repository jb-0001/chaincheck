import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBase58CheckRaw } from "../utils/base58.js";
import { decodeBech32, convertBits } from "../utils/bech32.js";

// Transparent address version bytes (2-byte prefix)
const P2PKH_VERSION = 0x1cb8; // t1…
const P2SH_VERSION = 0x1cbd;  // t3…

// Sapling shielded address payload size (bytes)
const SAPLING_PAYLOAD_BYTES = 43;

export function validateZcash(
  address: string,
  chain: "zcash",
  ticker: string,
  _opts: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  // ── Sapling shielded address (zs…) ────────────────────────────────────────
  const lower2 = address.slice(0, 2).toLowerCase();
  if (lower2 === "zs") {
    const bech = decodeBech32(address);
    if (!bech || bech.hrp !== "zs") {
      return fail("Invalid Zcash Sapling address: invalid bech32 encoding or wrong HRP");
    }
    const data = convertBits(bech.words, 5, 8, false);
    if (!data || data.length !== SAPLING_PAYLOAD_BYTES) {
      return fail("Invalid Zcash Sapling address: unexpected payload length");
    }
    return { valid: true, chain, ticker, addressType: "sapling" };
  }

  // ── Transparent address (t1… or t3…) ──────────────────────────────────────
  // decodeBase58CheckRaw returns version + payload (no checksum)
  // For Zcash transparent: 2 version bytes + 20 payload bytes = 22 bytes
  const decoded = decodeBase58CheckRaw(address);
  if (!decoded || decoded.length !== 22) {
    return fail(
      "Invalid Zcash address: must be a transparent (t1/t3) or Sapling shielded (zs) address"
    );
  }

  const version = (decoded[0]! << 8) | decoded[1]!;

  if (version === P2PKH_VERSION) {
    return { valid: true, chain, ticker, addressType: "p2pkh" };
  }
  if (version === P2SH_VERSION) {
    return { valid: true, chain, ticker, addressType: "p2sh" };
  }

  return fail("Invalid Zcash address: unknown version bytes");
}
