import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("Bitcoin address validation", () => {
  describe("valid P2PKH (legacy, 1…)", () => {
    it("accepts the genesis block P2PKH address", () => {
      const r = validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "btc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2pkh");
    });

    it("accepts 1BgGZ9tcN4s5FVrTU9ZVhafwznwo7ugEv8", () => {
      const r = validateSync("1BgGZ9tcN4s5FVrTU9ZVhafwznwo7ugEv8", "btc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2pkh");
    });

    it("accepts 1GUzLEEZyTckU5G3dU1Wd1vweKtdAHH7hA", () => {
      const r = validateSync("1GUzLEEZyTckU5G3dU1Wd1vweKtdAHH7hA", "btc");
      expect(r.valid).toBe(true);
    });

    it("accepts 1DYwPTpZuLjY2qApmJdHaSAuWRvEF5skCN", () => {
      const r = validateSync("1DYwPTpZuLjY2qApmJdHaSAuWRvEF5skCN", "btc");
      expect(r.valid).toBe(true);
    });
  });

  describe("valid P2SH (3…)", () => {
    it("accepts 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", () => {
      const r = validateSync("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", "btc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2sh");
    });

    it("accepts 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5", () => {
      const r = validateSync("3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5", "btc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2sh");
    });
  });

  describe("valid Bech32 / SegWit (bc1q…)", () => {
    it("accepts P2WPKH (20-byte witness program)", () => {
      const r = validateSync("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", "btc");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("bech32");
    });

    it("accepts P2WSH (32-byte witness program)", () => {
      const r = validateSync(
        "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3",
        "btc"
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("bech32");
    });
  });

  describe("valid Bech32m / Taproot (bc1p…)", () => {
    it("accepts a Taproot P2TR address", () => {
      const r = validateSync(
        "bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297",
        "btc"
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("bech32m");
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "btc").valid).toBe(false);
    });

    it("rejects bad Base58Check checksum (last char flipped)", () => {
      const r = validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf2", "btc");
      expect(r.valid).toBe(false);
    });

    it("rejects address that is too short (24 decoded bytes)", () => {
      const r = validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf", "btc");
      expect(r.valid).toBe(false);
    });

    it("rejects an EVM address", () => {
      const r = validateSync("0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "btc");
      expect(r.valid).toBe(false);
    });

    it("rejects bech32 with wrong HRP", () => {
      const r = validateSync("bc2qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", "btc");
      expect(r.valid).toBe(false);
    });

    it("rejects address with invalid Base58 character 'l'", () => {
      const r = validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf1l", "btc");
      expect(r.valid).toBe(false);
    });

    it("rejects a Tron address", () => {
      const r = validateSync("TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW", "btc");
      expect(r.valid).toBe(false);
    });
  });
});
