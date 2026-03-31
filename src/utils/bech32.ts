/**
 * Bech32 and Bech32m decoder — implements BIP-173 and BIP-350.
 */

const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

const CHAR_MAP = new Map<string, number>();
for (let i = 0; i < CHARSET.length; i++) {
  CHAR_MAP.set(CHARSET[i]!, i);
}

const BECH32_CONST = 1;
const BECH32M_CONST = 0x2bc830a3;

export type Bech32Variant = "bech32" | "bech32m";

function polymod(values: number[]): number {
  let chk = 1;
  for (const v of values) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) {
      if ((top >> i) & 1) chk ^= GENERATOR[i]!;
    }
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  const result: number[] = [];
  for (const c of hrp) result.push(c.charCodeAt(0) >> 5);
  result.push(0);
  for (const c of hrp) result.push(c.charCodeAt(0) & 31);
  return result;
}

function verifyChecksum(hrp: string, data: number[]): Bech32Variant | null {
  const check = polymod([...hrpExpand(hrp), ...data]);
  if (check === BECH32_CONST) return "bech32";
  if (check === BECH32M_CONST) return "bech32m";
  return null;
}

/**
 * Decode a Bech32 or Bech32m string.
 * Returns { hrp, words (5-bit groups without checksum), variant } or null on failure.
 * Pass `{ maxLength }` to override the default 90-char BIP-173 limit (e.g. Cardano needs 150).
 */
export function decodeBech32(
  str: string,
  options?: { maxLength?: number }
): { hrp: string; words: number[]; variant: Bech32Variant } | null {
  const maxLen = options?.maxLength ?? 90;
  // Must be all lowercase or all uppercase (not mixed)
  if (str !== str.toLowerCase() && str !== str.toUpperCase()) return null;
  const s = str.toLowerCase();

  const sep = s.lastIndexOf("1");
  if (sep < 1 || sep + 7 > s.length || s.length > maxLen) return null;

  const hrp = s.slice(0, sep);
  const dataStr = s.slice(sep + 1);

  const data: number[] = [];
  for (const c of dataStr) {
    const v = CHAR_MAP.get(c);
    if (v === undefined) return null;
    data.push(v);
  }

  const variant = verifyChecksum(hrp, data);
  if (!variant) return null;

  return { hrp, words: data.slice(0, -6), variant };
}

/**
 * Convert between bit-widths (e.g. 5-bit groups → 8-bit bytes).
 */
export function convertBits(
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
