import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("Solana address validation", () => {
  describe("valid addresses", () => {
    it("accepts a 44-char Solana address", () => {
      const r = validateSync("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM", "sol/sol");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("base58");
      expect(r.chain).toBe("solana");
    });

    it("accepts Wrapped SOL mint", () => {
      const r = validateSync("So11111111111111111111111111111111111111112", "sol/sol");
      expect(r.valid).toBe(true);
    });

    it("accepts USDC mint", () => {
      const r = validateSync("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "sol/usdc");
      expect(r.valid).toBe(true);
    });

    it("accepts USDT mint", () => {
      const r = validateSync("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "sol/usdt");
      expect(r.valid).toBe(true);
    });

    it("accepts 32-char System Program address", () => {
      const r = validateSync("11111111111111111111111111111111", "sol/sol");
      expect(r.valid).toBe(true);
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "sol/sol").valid).toBe(false);
    });

    it("rejects an EVM address (0x prefix)", () => {
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "sol/sol");
      expect(r.valid).toBe(false);
    });

    it("rejects a string that is 45 characters (too long)", () => {
      const r = validateSync("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "sol/sol");
      expect(r.valid).toBe(false);
    });

    it("rejects a string containing '0' (invalid Base58 char)", () => {
      const r = validateSync("0000000000000000000000000000000000000000000", "sol/sol");
      expect(r.valid).toBe(false);
    });

    it("rejects a Bitcoin address", () => {
      const r = validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf1", "sol/sol");
      expect(r.valid).toBe(false);
    });
  });

  describe("strictSolana throws in sync mode", () => {
    it("throws when strictSolana is used with validateSync", () => {
      expect(() =>
        validateSync("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM", "sol/sol", {
          strictSolana: true,
        })
      ).toThrow(/strictSolana/);
    });
  });
});
