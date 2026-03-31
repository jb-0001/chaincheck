import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("Aptos address validation", () => {
  describe("valid addresses", () => {
    it("accepts a full 64-hex-char address", () => {
      const r = validateSync(
        "0x1d8727df513fa2a8785d0834e40b34223daff1affc078b83e6a8f2b3f1f01234",
        "apt"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("aptos");
      expect(r.addressType).toBe("hex");
    });

    it("accepts the framework address 0x1", () => {
      const r = validateSync("0x1", "apt");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("hex");
    });

    it("accepts a short address 0xab", () => {
      const r = validateSync("0xab", "apt");
      expect(r.valid).toBe(true);
    });

    it("accepts mixed-case hex", () => {
      const r = validateSync(
        "0x1D8727Df513Fa2A8785D0834e40b34223DAFF1afFC078b83E6A8F2B3F1f01234",
        "apt"
      );
      expect(r.valid).toBe(true);
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "apt").valid).toBe(false);
    });

    it("rejects address without 0x prefix", () => {
      expect(
        validateSync(
          "1d8727df513fa2a8785d0834e40b34223daff1affc078b83e6a8f2b3f1f01234",
          "apt"
        ).valid
      ).toBe(false);
    });

    it("rejects 0x alone (no hex digits)", () => {
      expect(validateSync("0x", "apt").valid).toBe(false);
    });

    it("rejects address with more than 64 hex chars after 0x", () => {
      expect(
        validateSync(
          "0x1d8727df513fa2a8785d0834e40b34223daff1affc078b83e6a8f2b3f1f012345",
          "apt"
        ).valid
      ).toBe(false);
    });

    it("rejects non-hex characters after 0x", () => {
      expect(validateSync("0xGHIJKL", "apt").valid).toBe(false);
    });

    it("rejects a Bitcoin address", () => {
      expect(validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "apt").valid).toBe(false);
    });
  });

  describe("chain name passthrough", () => {
    it("works with chain name 'aptos'", () => {
      const r = validateSync("0x1", "aptos");
      expect(r.valid).toBe(true);
    });
  });
});
