import type { ValidationResult, ValidateOptions } from "../types.js";
import { decodeBase58 } from "../utils/base58.js";

const SOLANA_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function validateSolana(
  address: string,
  chain: "solana",
  ticker: string,
  options: ValidateOptions
): Promise<ValidationResult> {
  const fail = (error: string): ValidationResult => ({
    valid: false,
    chain,
    ticker,
    error,
  });

  if (!SOLANA_REGEX.test(address)) {
    return fail("Invalid Solana address format: must be 32–44 Base58 characters");
  }

  const decoded = decodeBase58(address);
  if (!decoded || decoded.length !== 32) {
    return fail("Invalid Solana address: must decode to exactly 32 bytes");
  }

  if (options.strictSolana) {
    try {
      // Dynamically import @noble/curves — optional peer dependency
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const curves: any = await import("@noble/curves/ed25519" as string);
      const ed25519 = curves.ed25519;
      try {
        ed25519.ExtendedPoint.fromHex(decoded);
      } catch {
        return fail("Invalid Solana address: not a valid Ed25519 public key (off-curve)");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("off-curve")) {
        return fail("Invalid Solana address: not a valid Ed25519 public key (off-curve)");
      }
      return fail(
        "strictSolana requires @noble/curves to be installed: npm install @noble/curves"
      );
    }
  }

  return { valid: true, chain, ticker, addressType: "base58" };
}
