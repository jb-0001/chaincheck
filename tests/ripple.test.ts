import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("Ripple (XRP) address validation", () => {
  describe("valid addresses", () => {
    it("accepts the genesis/faucet address", () => {
      const r = validateSync("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "xrp");
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("ripple");
      expect(r.addressType).toBe("base58");
    });

    it("accepts a well-known exchange address", () => {
      const r = validateSync("rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh", "xrp");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("base58");
    });

    it("accepts another valid address", () => {
      const r = validateSync("r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "xrp");
      expect(r.valid).toBe(true);
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "xrp").valid).toBe(false);
    });

    it("rejects address not starting with r", () => {
      expect(validateSync("1Hb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "xrp").valid).toBe(false);
    });

    it("rejects address with invalid Base58 character (0)", () => {
      expect(validateSync("r0b9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "xrp").valid).toBe(false);
    });

    it("rejects address with bad checksum (last char changed)", () => {
      const r = validateSync("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTi", "xrp");
      expect(r.valid).toBe(false);
      expect(r.error).toMatch(/checksum/i);
    });

    it("rejects an EVM address", () => {
      expect(
        validateSync("0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "xrp").valid
      ).toBe(false);
    });

    it("rejects a Bitcoin address", () => {
      expect(validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "xrp").valid).toBe(false);
    });
  });

  describe("chain name passthrough", () => {
    it("works with chain name 'ripple'", () => {
      const r = validateSync("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "ripple");
      expect(r.valid).toBe(true);
    });
  });
});
