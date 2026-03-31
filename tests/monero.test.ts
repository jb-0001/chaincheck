import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

// All addresses below were computed from known byte sequences using the Monero
// Base58 encoding + Keccak-256 checksum, so their validity is guaranteed.

describe("Monero address validation", () => {
  describe("valid standard addresses (mainnet, starts with '4')", () => {
    it("accepts a known mainnet standard address (Monero Project donation)", () => {
      const r = validateSync(
        "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
        "xmr"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("monero");
      expect(r.addressType).toBe("monero-standard");
    });

    it("accepts a computed standard address", () => {
      // network byte 0x12, spend key = 0x01*32, view key = 0x02*32
      const r = validateSync(
        "41fKEPxoWUp1Ajszg3RAw21Ajszg3RAw21Ajszg3RAw21An5yYGLjbX1LUkzM5qLs31LUkzM5qLs31LUkzM5qLs31EX8a2t",
        "xmr"
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("monero-standard");
    });
  });

  describe("valid subaddresses (mainnet, starts with '8')", () => {
    it("accepts a computed mainnet subaddress", () => {
      // network byte 0x2a, spend key = 0x01*32, view key = 0x02*32
      const r = validateSync(
        "82VTZmce6uE1Ajszg3RAw21Ajszg3RAw21Ajszg3RAw21An5yYGLjbX1LUkzM5qLs31LUkzM5qLs31LUkzM5qLs31LPtZLm",
        "xmr"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("monero");
      expect(r.addressType).toBe("monero-subaddress");
    });
  });

  describe("valid integrated addresses (mainnet, 106 chars)", () => {
    it("accepts a computed mainnet integrated address", () => {
      // network byte 0x13, spend/view keys = 0x01/0x02*32, payment ID = 0x03*8
      const r = validateSync(
        "4BMzFCnJ7kL1Ajszg3RAw21Ajszg3RAw21Ajszg3RAw21An5yYGLjbX1LUkzM5qLs31LUkzM5qLs31LUkzM5qLs31LWxyDJkuXY1RGwbGT",
        "xmr"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("monero");
      expect(r.addressType).toBe("monero-integrated");
    });
  });

  describe("testnet addresses", () => {
    it("accepts a computed testnet standard address with testnet option", () => {
      // network byte 0x35
      const r = validateSync(
        "9sCried4nqv1Ajszg3RAw21Ajszg3RAw21Ajszg3RAw21An5yYGLjbX1LUkzM5qLs31LUkzM5qLs31LUkzM5qLs31KTHPB5",
        "xmr",
        { testnet: true }
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("monero-standard");
    });

    it("rejects a testnet address without testnet option", () => {
      const r = validateSync(
        "9sCried4nqv1Ajszg3RAw21Ajszg3RAw21Ajszg3RAw21An5yYGLjbX1LUkzM5qLs31LUkzM5qLs31LUkzM5qLs31KTHPB5",
        "xmr"
      );
      expect(r.valid).toBe(false);
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "xmr").valid).toBe(false);
    });

    it("rejects wrong length (94 chars)", () => {
      const r = validateSync(
        "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3",
        "xmr"
      );
      expect(r.valid).toBe(false);
    });

    it("rejects invalid Base58 character (0)", () => {
      const r = validateSync(
        "04AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
        "xmr"
      );
      expect(r.valid).toBe(false);
    });

    it("rejects address with bad checksum (last char changed)", () => {
      const r = validateSync(
        "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3B",
        "xmr"
      );
      expect(r.valid).toBe(false);
    });

    it("rejects an EVM address", () => {
      expect(
        validateSync("0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "xmr").valid
      ).toBe(false);
    });

    it("rejects a Bitcoin address", () => {
      expect(
        validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "xmr").valid
      ).toBe(false);
    });
  });

  describe("chain name passthrough", () => {
    it("works with chain name 'monero'", () => {
      const r = validateSync(
        "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
        "monero"
      );
      expect(r.valid).toBe(true);
    });
  });
});
