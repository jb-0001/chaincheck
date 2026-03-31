import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

// Transparent addresses were computed via Base58Check with Zcash version bytes.
// The Sapling address was computed via bech32 with "zs" HRP.
// All checksums are valid.

describe("Zcash address validation", () => {
  describe("valid transparent P2PKH addresses (t1…)", () => {
    it("accepts a computed t1 P2PKH address", () => {
      const r = validateSync("t1HxutHFt2Sejz7fs92wFVAbsFM7NDjsBG6", "zec");
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("zcash");
      expect(r.addressType).toBe("p2pkh");
    });
  });

  describe("valid transparent P2SH addresses (t3…)", () => {
    it("accepts a computed t3 P2SH address", () => {
      const r = validateSync("t3JevopkKaLy85HNJG8bqunxoPsQ5o8GRya", "zec");
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("zcash");
      expect(r.addressType).toBe("p2sh");
    });
  });

  describe("valid Sapling shielded addresses (zs…)", () => {
    it("accepts a computed Sapling address", () => {
      // 43-byte payload, bech32 with HRP "zs"
      const r = validateSync(
        "zs1qyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszvsj7ke",
        "zec"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("zcash");
      expect(r.addressType).toBe("sapling");
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "zec").valid).toBe(false);
    });

    it("rejects a Bitcoin address (wrong version)", () => {
      expect(validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "zec").valid).toBe(false);
    });

    it("rejects an EVM address", () => {
      expect(
        validateSync("0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "zec").valid
      ).toBe(false);
    });

    it("rejects a t1 address with bad checksum (last char changed)", () => {
      // Change last char from '6' to '7'
      const r = validateSync("t1HxutHFt2Sejz7fs92wFVAbsFM7NDjsBG7", "zec");
      expect(r.valid).toBe(false);
    });
  });

  describe("chain name passthrough", () => {
    it("works with chain name 'zcash'", () => {
      const r = validateSync("t1HxutHFt2Sejz7fs92wFVAbsFM7NDjsBG6", "zcash");
      expect(r.valid).toBe(true);
    });
  });
});
