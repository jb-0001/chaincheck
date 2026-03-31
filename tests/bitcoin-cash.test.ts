import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("Bitcoin Cash address validation", () => {
  describe("valid CashAddr (with prefix)", () => {
    it("accepts a P2PKH CashAddr with prefix", () => {
      const r = validateSync(
        "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
        "bch"
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("cashaddr");
      expect(r.chain).toBe("bitcoinCash");
    });

    it("accepts bitcoincash:qp63uahgrxgedavd9nv4dtyu783r72v43u78j220ss", () => {
      const r = validateSync(
        "bitcoincash:qp63uahgrxgedavd9nv4dtyu783r72v43u78j220ss",
        "bch"
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("cashaddr");
    });
  });

  describe("valid CashAddr (without prefix)", () => {
    it("accepts CashAddr without bitcoincash: prefix", () => {
      const r = validateSync(
        "qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
        "bch"
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("cashaddr");
    });
  });

  describe("valid legacy Base58Check", () => {
    it("accepts legacy P2PKH address (1BgGZ…)", () => {
      // Bitcoin P2PKH addresses are also valid legacy BCH addresses
      const r = validateSync("1BgGZ9tcN4s5FVrTU9ZVhafwznwo7ugEv8", "bch");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2pkh");
    });

    it("accepts legacy P2SH address", () => {
      const r = validateSync("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", "bch");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2sh");
    });
  });

  describe("requireCashAddr option", () => {
    it("rejects legacy address when requireCashAddr is true", () => {
      const r = validateSync("1BgGZ9tcN4s5FVrTU9ZVhafwznwo7ugEv8", "bch", {
        requireCashAddr: true,
      });
      expect(r.valid).toBe(false);
      expect(r.error).toMatch(/requireCashAddr/);
    });

    it("accepts CashAddr when requireCashAddr is true", () => {
      const r = validateSync(
        "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
        "bch",
        { requireCashAddr: true }
      );
      expect(r.valid).toBe(true);
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "bch").valid).toBe(false);
    });

    it("rejects bad CashAddr checksum (last char flipped)", () => {
      const r = validateSync(
        "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6b",
        "bch"
      );
      expect(r.valid).toBe(false);
    });

    it("rejects a Bitcoin SegWit address", () => {
      const r = validateSync(
        "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
        "bch"
      );
      expect(r.valid).toBe(false);
    });
  });
});
