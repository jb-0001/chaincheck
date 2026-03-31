import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

// X/P-chain bech32 addresses were computed with a 20-byte test payload and
// valid "avax" HRP bech32 checksum. EVM addresses are from evm.test.ts.

describe("Avalanche address validation", () => {
  describe("valid C-Chain EVM addresses (0x…)", () => {
    it("accepts an all-lowercase EVM address", () => {
      const r = validateSync(
        "0xb794f5ea0ba39494ce839613fffba74279579268",
        "avax"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("avalanche");
      expect(r.addressType).toBe("hex");
    });

    it("accepts an EIP-55 checksummed EVM address", () => {
      // Vitalik's address — verified valid in evm.test.ts
      const r = validateSync(
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "avax"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("avalanche");
      expect(r.addressType).toBe("eip55");
    });
  });

  describe("valid X-Chain addresses (X-avax1…)", () => {
    it("accepts a computed mainnet X-Chain address", () => {
      // 20-byte test payload, valid bech32 checksum
      const r = validateSync(
        "X-avax1zg69v7y6hn00qyfzxdz92enh3zv64w7vanlrwv",
        "avax"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("avalanche");
      expect(r.addressType).toBe("bech32");
    });
  });

  describe("valid P-Chain addresses (P-avax1…)", () => {
    it("accepts a computed mainnet P-Chain address", () => {
      // zero-payload address, valid bech32 checksum
      const r = validateSync(
        "P-avax1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxpdk7q",
        "avax"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("avalanche");
      expect(r.addressType).toBe("bech32");
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "avax").valid).toBe(false);
    });

    it("rejects a bech32 address without chain prefix", () => {
      expect(
        validateSync("avax1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxpdk7q", "avax").valid
      ).toBe(false);
    });

    it("rejects an EVM address with bad EIP-55 checksum", () => {
      // mixed-case but wrong EIP-55 checksum
      const r = validateSync(
        "0xd8Da6BF26964aF9D7eEd9e03E53415D37aA96045",
        "avax"
      );
      expect(r.valid).toBe(false);
    });

    it("rejects a Bitcoin address", () => {
      expect(validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "avax").valid).toBe(false);
    });
  });

  describe("chain name passthrough", () => {
    it("works with chain name 'avalanche'", () => {
      const r = validateSync(
        "0xb794f5ea0ba39494ce839613fffba74279579268",
        "avalanche"
      );
      expect(r.valid).toBe(true);
    });
  });
});
