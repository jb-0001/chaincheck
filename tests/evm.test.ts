import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("EVM address validation", () => {
  describe("valid addresses", () => {
    it("accepts a valid EIP-55 checksummed address (Vitalik)", () => {
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "eth");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("eip55");
    });

    it("accepts another EIP-55 address", () => {
      const r = validateSync("0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "eth");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("eip55");
    });

    it("accepts an all-lowercase address (no checksum)", () => {
      const r = validateSync("0x0000000000000000000000000000000000000000", "eth");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("hex");
    });

    it("accepts an all-uppercase address (no checksum)", () => {
      const r = validateSync("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", "eth");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("hex");
    });

    it("accepts Ethereum Foundation address", () => {
      const r = validateSync("0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe", "eth");
      expect(r.valid).toBe(true);
    });

    it("works with erc20/usdt ticker", () => {
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "erc20/usdt");
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("evm");
    });

    it("works with bep20/usdt ticker", () => {
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "bep20/usdt");
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("evm");
    });

    it("works with arbitrum/usdc ticker", () => {
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "arbitrum/usdc");
      expect(r.valid).toBe(true);
    });

    it("works with bep20/ltc (EVM, not Litecoin)", () => {
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "bep20/ltc");
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("evm");
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      const r = validateSync("", "eth");
      expect(r.valid).toBe(false);
    });

    it("rejects bad EIP-55 checksum", () => {
      // last char changed from 5 to 6
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046", "eth");
      expect(r.valid).toBe(false);
      expect(r.error).toMatch(/checksum/i);
    });

    it("rejects address that is too long", () => {
      const r = validateSync("0xd8da6bf26964af9d7eed9e03e53415d37aa96045abc", "eth");
      expect(r.valid).toBe(false);
    });

    it("rejects address missing 0x prefix", () => {
      const r = validateSync("742d35Cc6634C0532925a3b844Bc454e4438f44e", "eth");
      expect(r.valid).toBe(false);
    });

    it("rejects address with invalid hex characters", () => {
      const r = validateSync("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG", "eth");
      expect(r.valid).toBe(false);
    });

    it("rejects a Tron address", () => {
      const r = validateSync("TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW", "eth");
      expect(r.valid).toBe(false);
    });
  });
});
