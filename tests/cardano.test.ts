import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

// Enterprise addresses (type 6/7): 1 header byte + 28-byte payment key hash, ~58–63 chars bech32.
// Base addresses (type 0/1): 1 header + 28 payment + 28 staking key bytes, ~103 chars bech32
//   (exceeds BIP-173 90-char limit; our validator passes { maxLength: 150 } to decodeBech32).
// The computed addresses below use zero-filled key hashes for reproducibility.

describe("Cardano address validation", () => {
  describe("valid Shelley mainnet addresses (addr1…)", () => {
    it("accepts a base address (payment + staking credential, >90 chars)", () => {
      // type 0 mainnet: header 0x01, 28 zero payment bytes, 28 zero staking bytes
      const r = validateSync(
        "addr1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv2t5am",
        "ada"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("cardano");
      expect(r.addressType).toBe("shelley");
    });

    it("accepts an enterprise address (payment credential only, CIP-19 test vector)", () => {
      // 58 chars — within the default 90-char limit
      const r = validateSync(
        "addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8",
        "ada"
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("shelley");
    });
  });

  describe("valid Shelley testnet addresses", () => {
    it("accepts a testnet enterprise address with testnet option", () => {
      // type 7 testnet enterprise: header 0x71, 28 zero payment bytes
      const r = validateSync(
        "addr_test1wyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqyl8erv",
        "ada",
        { testnet: true }
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("shelley");
    });

    it("rejects a testnet address without testnet option", () => {
      const r = validateSync(
        "addr_test1wyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqyl8erv",
        "ada"
      );
      expect(r.valid).toBe(false);
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "ada").valid).toBe(false);
    });

    it("rejects an EVM address", () => {
      expect(
        validateSync("0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "ada").valid
      ).toBe(false);
    });

    it("rejects a Bitcoin address", () => {
      expect(validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "ada").valid).toBe(false);
    });
  });

  describe("chain name passthrough", () => {
    it("works with chain name 'cardano'", () => {
      const r = validateSync(
        "addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8",
        "cardano"
      );
      expect(r.valid).toBe(true);
    });
  });
});
