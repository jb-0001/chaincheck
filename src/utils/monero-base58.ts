/**
 * Monero Base58 decoder.
 *
 * Monero uses the same alphabet as Bitcoin Base58 but a different encoding strategy:
 * data is split into 8-byte blocks, each encoded as exactly 11 Base58 characters.
 * A partial trailing block is encoded with fewer characters per the table below.
 *
 * Encoded chars → decoded bytes:
 *   2→1, 3→2, 5→3, 6→4, 7→5, 9→6, 10→7, 11→8
 */

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const CHAR_MAP = new Map<string, bigint>();
for (let i = 0; i < ALPHABET.length; i++) {
  CHAR_MAP.set(ALPHABET[i]!, BigInt(i));
}

const FULL_ENCODED = 11;
const FULL_DECODED = 8;

/** Maps encoded block length → decoded byte count */
const ENC_TO_DEC: Record<number, number> = {
  2: 1,
  3: 2,
  5: 3,
  6: 4,
  7: 5,
  9: 6,
  10: 7,
  11: 8,
};

function decodeBlock(chars: string, outBytes: number): Uint8Array | null {
  let value = 0n;
  for (const c of chars) {
    const digit = CHAR_MAP.get(c);
    if (digit === undefined) return null;
    value = value * 58n + digit;
  }

  // Value must fit in outBytes bytes
  const maxValue = (1n << BigInt(outBytes * 8)) - 1n;
  if (value > maxValue) return null;

  const result = new Uint8Array(outBytes);
  for (let i = outBytes - 1; i >= 0; i--) {
    result[i] = Number(value & 0xffn);
    value >>= 8n;
  }

  return result;
}

/**
 * Decode a Monero Base58-encoded string to bytes.
 * Returns null if the string contains invalid characters, has an invalid block
 * structure, or any block value overflows its expected byte size.
 */
export function decodeMoneroBase58(str: string): Uint8Array | null {
  if (str.length === 0) return null;

  const fullBlocks = Math.floor(str.length / FULL_ENCODED);
  const remainder = str.length % FULL_ENCODED;

  if (remainder !== 0 && !(remainder in ENC_TO_DEC)) return null;

  const partialBytes = remainder > 0 ? ENC_TO_DEC[remainder]! : 0;
  const totalBytes = fullBlocks * FULL_DECODED + partialBytes;
  const result = new Uint8Array(totalBytes);

  let outOffset = 0;
  for (let i = 0; i < fullBlocks; i++) {
    const block = str.slice(i * FULL_ENCODED, (i + 1) * FULL_ENCODED);
    const decoded = decodeBlock(block, FULL_DECODED);
    if (!decoded) return null;
    result.set(decoded, outOffset);
    outOffset += FULL_DECODED;
  }

  if (remainder > 0) {
    const block = str.slice(fullBlocks * FULL_ENCODED);
    const decoded = decodeBlock(block, partialBytes);
    if (!decoded) return null;
    result.set(decoded, outOffset);
  }

  return result;
}
