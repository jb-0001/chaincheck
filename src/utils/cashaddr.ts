/**
 * Bitcoin Cash CashAddr decoder — implements the CashAddr specification.
 * https://github.com/bitcoincashorg/bitcoincash.org/blob/master/spec/cashaddr.md
 */

const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const CHAR_MAP = new Map<string, number>();
for (let i = 0; i < CHARSET.length; i++) {
  CHAR_MAP.set(CHARSET[i]!, i);
}

function polymod(data: number[]): bigint {
  const GENERATOR = [
    0x98f2bc8e61n,
    0x79b76d99e2n,
    0xf33e5fb3c4n,
    0xae2eabe2a8n,
    0x1e4f43e470n,
  ];
  let checksum = 1n;
  for (const value of data) {
    const high = checksum >> 35n;
    checksum = ((checksum & 0x07ffffffffn) << 5n) ^ BigInt(value);
    for (let i = 0; i < 5; i++) {
      if ((high >> BigInt(i)) & 1n) {
        checksum ^= GENERATOR[i]!;
      }
    }
  }
  return checksum ^ 1n;
}

function prefixExpand(prefix: string): number[] {
  const result: number[] = [];
  for (const c of prefix) result.push(c.charCodeAt(0) & 0x1f);
  result.push(0);
  return result;
}

/**
 * Decode a CashAddr string (with or without "bitcoincash:" prefix).
 * Returns { type, hash } or null on failure.
 */
export function decodeCashAddr(
  str: string
): { type: "p2pkh" | "p2sh"; hash: Uint8Array } | null {
  const lower = str.toLowerCase();

  let prefix: string;
  let payload: string;

  if (lower.includes(":")) {
    const colonIdx = lower.indexOf(":");
    prefix = lower.slice(0, colonIdx);
    payload = lower.slice(colonIdx + 1);
    if (prefix !== "bitcoincash") return null;
  } else {
    prefix = "bitcoincash";
    payload = lower;
  }

  // Decode payload characters
  const data: number[] = [];
  for (const c of payload) {
    const v = CHAR_MAP.get(c);
    if (v === undefined) return null;
    data.push(v);
  }

  // Minimum: version byte (2 5-bit groups) + 20-byte hash (32 5-bit groups) + 8 checksum groups = 42
  if (data.length < 42) return null;

  // Verify checksum
  const check = polymod([...prefixExpand(prefix), ...data]);
  if (check !== 0n) return null;

  // Remove checksum (last 8 groups)
  const payload5bit = data.slice(0, -8);

  // Convert 5-bit groups to 8-bit bytes
  const bytes = convertBits(payload5bit, 5, 8, false);
  if (!bytes) return null;

  // First byte is version byte
  const versionByte = bytes[0]!;
  const hashType = (versionByte >> 3) & 0x1f; // bits 7-3
  const hashSizeBits = versionByte & 0x07;    // bits 2-0

  // Hash size lookup (bits 2-0 → byte length)
  const HASH_SIZES = [20, 24, 28, 32, 40, 48, 56, 64];
  const expectedHashLen = HASH_SIZES[hashSizeBits];
  if (expectedHashLen === undefined) return null;

  const hash = new Uint8Array(bytes.slice(1));
  if (hash.length !== expectedHashLen) return null;

  // hashType 0 = P2PKH, 1 = P2SH
  if (hashType !== 0 && hashType !== 1) return null;

  return {
    type: hashType === 0 ? "p2pkh" : "p2sh",
    hash,
  };
}

function convertBits(
  data: number[],
  fromBits: number,
  toBits: number,
  pad: boolean
): number[] | null {
  let acc = 0;
  let bits = 0;
  const result: number[] = [];
  const maxv = (1 << toBits) - 1;

  for (const value of data) {
    if (value < 0 || value >> fromBits !== 0) return null;
    acc = (acc << fromBits) | value;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      result.push((acc >> bits) & maxv);
    }
  }

  if (pad) {
    if (bits > 0) result.push((acc << (toBits - bits)) & maxv);
  } else if (bits >= fromBits || ((acc << (toBits - bits)) & maxv) !== 0) {
    return null;
  }

  return result;
}
