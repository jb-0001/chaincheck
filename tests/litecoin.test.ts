import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("Litecoin address validation", () => {
  describe("valid P2PKH (L…)", () => {
    it("accepts LaMT348PWRnrqeeWArpwQPbuanpXDZGEUz", () => {
      const r = validateSync("LaMT348PWRnrqeeWArpwQPbuanpXDZGEUz", "ltc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2pkh");
      expect(r.chain).toBe("litecoin");
    });

    it("accepts LdP8Qox1VAhCzLJNqrr74YovaWYyNBUWvL", () => {
      const r = validateSync("LdP8Qox1VAhCzLJNqrr74YovaWYyNBUWvL", "ltc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2pkh");
    });
  });

  describe("valid P2SH-SegWit (M…)", () => {
    it("accepts MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441", () => {
      const r = validateSync("MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441", "ltc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2sh");
    });
  });

  describe("valid legacy P2SH (3…)", () => {
    it("accepts a 3-prefix P2SH address", () => {
      const r = validateSync("3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC", "ltc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2sh");
    });
  });

  describe("valid Bech32 (ltc1…)", () => {
    it("accepts ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kgmn4n9", () => {
      const r = validateSync("ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kgmn4n9", "ltc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("bech32");
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "ltc").valid).toBe(false);
    });

    it("rejects bad checksum", () => {
      const r = validateSync("LaMT348PWRnrqeeWArpwQPbuanpXDZGEUy", "ltc");
      expect(r.valid).toBe(false);
    });

    it("rejects a Bitcoin P2PKH address", () => {
      const r = validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf1", "ltc");
      expect(r.valid).toBe(false);
    });

    it("rejects a Bitcoin Bech32 address (wrong HRP 'bc')", () => {
      const r = validateSync("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", "ltc");
      expect(r.valid).toBe(false);
    });
  });
});
