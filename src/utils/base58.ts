import { sha256d } from "./hash.js";

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE = BigInt(58);

const CHAR_MAP = new Map<string, bigint>();
for (let i = 0; i < ALPHABET.length; i++) {
  CHAR_MAP.set(ALPHABET[i]!, BigInt(i));
}

/**
 * Decode a Base58-encoded string to bytes.
 * Returns null if any character is not in the Base58 alphabet.
 */
export function decodeBase58(s: string): Uint8Array | null {
  if (s.length === 0) return null;

  let num = BigInt(0);
  for (const char of s) {
    const digit = CHAR_MAP.get(char);
    if (digit === undefined) return null;
    num = num * BASE + digit;
  }

  // Count leading '1's → leading zero bytes
  let leadingZeros = 0;
  for (const char of s) {
    if (char === "1") leadingZeros++;
    else break;
  }

  // Convert BigInt to bytes
  const bytes: number[] = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn));
    num >>= 8n;
  }

  return new Uint8Array([...new Array(leadingZeros).fill(0), ...bytes]);
}

/**
 * Decode a Base58-encoded string using a custom alphabet.
 * Returns null if any character is not in the supplied alphabet.
 */
export function decodeBase58WithAlphabet(
  s: string,
  alphabet: string
): Uint8Array | null {
  if (s.length === 0) return null;
  if (alphabet.length !== 58) return null;

  const charMap = new Map<string, bigint>();
  for (let i = 0; i < alphabet.length; i++) {
    charMap.set(alphabet[i]!, BigInt(i));
  }

  let num = BigInt(0);
  for (const char of s) {
    const digit = charMap.get(char);
    if (digit === undefined) return null;
    num = num * BigInt(58) + digit;
  }

  const leadingChar = alphabet[0]!;
  let leadingZeros = 0;
  for (const char of s) {
    if (char === leadingChar) leadingZeros++;
    else break;
  }

  const bytes: number[] = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn));
    num >>= 8n;
  }

  return new Uint8Array([...new Array(leadingZeros).fill(0), ...bytes]);
}

/**
 * Decode a Base58Check-encoded address without assuming a fixed length.
 * Returns the version+payload bytes (everything except the 4-byte checksum), or null on failure.
 * Minimum total decoded length is 5 bytes (at least 1 byte payload + 4 checksum).
 */
export function decodeBase58CheckRaw(s: string): Uint8Array | null {
  const decoded = decodeBase58(s);
  if (!decoded || decoded.length < 5) return null;

  const body = decoded.slice(0, decoded.length - 4);
  const checksum = decoded.slice(decoded.length - 4);
  const expected = sha256d(body).slice(0, 4);

  if (
    checksum[0] !== expected[0] ||
    checksum[1] !== expected[1] ||
    checksum[2] !== expected[2] ||
    checksum[3] !== expected[3]
  ) {
    return null;
  }

  return body;
}

/**
 * Decode a Base58Check-encoded address.
 * Returns { version, payload } if checksum is valid, or null on failure.
 * Expects the decoded result to be exactly 25 bytes (1 version + 20 payload + 4 checksum).
 */
export function decodeBase58Check(
  s: string
): { version: number; payload: Uint8Array } | null {
  const decoded = decodeBase58(s);
  if (!decoded || decoded.length !== 25) return null;

  const body = decoded.slice(0, 21);
  const checksum = decoded.slice(21);
  const expected = sha256d(body).slice(0, 4);

  if (
    checksum[0] !== expected[0] ||
    checksum[1] !== expected[1] ||
    checksum[2] !== expected[2] ||
    checksum[3] !== expected[3]
  ) {
    return null;
  }

  return {
    version: decoded[0]!,
    payload: decoded.slice(1, 21),
  };
}
