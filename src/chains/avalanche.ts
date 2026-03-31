import type { ValidationResult, ValidateOptions } from "../types.js";
import { validateEvm } from "./evm.js";
import { decodeBech32, convertBits } from "../utils/bech32.js";

// AVAX X/P/C-chain bech32 addresses: 20-byte payload
const AVAX_PAYLOAD_BYTES = 20;

export function validateAvalanche(
  address: string,
  chain: "avalanche",
  ticker: string,
  opts: ValidateOptions
): ValidationResult {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  // ── C-Chain: EVM format (0x + 40 hex chars) ───────────────────────────────
  if (address.startsWith("0x") || address.startsWith("0X")) {
    const evmResult = validateEvm(address, "evm", ticker, opts);
    return { ...evmResult, chain };
  }

  // ── X-Chain / P-Chain / C-Chain bech32: {X|P|C}-{hrp}1… ─────────────────
  const match = /^([XPCxpc])-(.+)$/.exec(address);
  if (match) {
    const bech32Part = match[2]!;
    const bech = decodeBech32(bech32Part);
    if (!bech) {
      return fail("Invalid Avalanche address: invalid bech32 encoding after chain prefix");
    }

    const isMainnet = bech.hrp === "avax";
    const isTestnet = opts.testnet && bech.hrp === "fuji";

    if (!isMainnet && !isTestnet) {
      return fail(
        `Invalid Avalanche address: expected HRP "avax"${opts.testnet ? ' or "fuji"' : ""}, got "${bech.hrp}"`
      );
    }

    const data = convertBits(bech.words, 5, 8, false);
    if (!data || data.length !== AVAX_PAYLOAD_BYTES) {
      return fail("Invalid Avalanche address: unexpected payload length");
    }

    return { valid: true, chain, ticker, addressType: "bech32" };
  }

  return fail(
    "Invalid Avalanche address: must be a C-Chain EVM address (0x…) or X/P/C-chain bech32 address (X-avax1…)"
  );
}
