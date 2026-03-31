import type { ValidationResult, ValidateOptions, AddressType } from "../types.js";
import { decodeMoneroBase58 } from "../utils/monero-base58.js";
import { keccak256 } from "../utils/hash.js";

// Mainnet network bytes
const MAINNET_STANDARD = 0x12;   // 18  — standard address, starts with '4'
const MAINNET_INTEGRATED = 0x13; // 19  — integrated address (8-byte payment ID)
const MAINNET_SUBADDRESS = 0x2a; // 42  — subaddress, starts with '8'

// Testnet network bytes
const TESTNET_STANDARD = 0x35;    // 53
const TESTNET_INTEGRATED = 0x36;  // 54
const TESTNET_SUBADDRESS = 0x3f;  // 63

// Byte lengths (version + keys + [payment ID] + checksum)
const STANDARD_BYTES = 69;    // 1 + 32 + 32 + 4
const INTEGRATED_BYTES = 77;  // 1 + 32 + 32 + 8 + 4

export function validateMonero(
  address: string,
  chain: "monero",
  ticker: string,
  opts: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  if (address.length !== 95 && address.length !== 106) {
    return fail(
      "Invalid Monero address length: expected 95 (standard/subaddress) or 106 (integrated)"
    );
  }

  const decoded = decodeMoneroBase58(address);
  if (!decoded) {
    return fail("Invalid Monero address: contains characters outside Base58 alphabet");
  }

  const networkByte = decoded[0]!;
  const expectedLength = address.length === 95 ? STANDARD_BYTES : INTEGRATED_BYTES;

  if (decoded.length !== expectedLength) {
    return fail("Invalid Monero address: decoded byte count mismatch");
  }

  let addressType: AddressType;

  if (address.length === 106) {
    if (networkByte === MAINNET_INTEGRATED) {
      addressType = "monero-integrated";
    } else if (opts.testnet && networkByte === TESTNET_INTEGRATED) {
      addressType = "monero-integrated";
    } else {
      return fail("Invalid Monero integrated address: unknown network byte");
    }
  } else {
    if (networkByte === MAINNET_STANDARD) {
      addressType = "monero-standard";
    } else if (networkByte === MAINNET_SUBADDRESS) {
      addressType = "monero-subaddress";
    } else if (opts.testnet && networkByte === TESTNET_STANDARD) {
      addressType = "monero-standard";
    } else if (opts.testnet && networkByte === TESTNET_SUBADDRESS) {
      addressType = "monero-subaddress";
    } else {
      return fail("Invalid Monero address: unknown network byte");
    }
  }

  // Verify checksum: first 4 bytes of Keccak-256 of everything except the last 4 bytes
  const body = decoded.slice(0, decoded.length - 4);
  const checksum = decoded.slice(decoded.length - 4);
  const expected = keccak256(body);

  if (
    checksum[0] !== expected[0] ||
    checksum[1] !== expected[1] ||
    checksum[2] !== expected[2] ||
    checksum[3] !== expected[3]
  ) {
    return fail("Invalid Monero address: checksum mismatch");
  }

  return { valid: true, chain, ticker, addressType };
}
