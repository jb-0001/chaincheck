import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("Tron address validation", () => {
  describe("valid addresses", () => {
    it("accepts TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW", () => {
      const r = validateSync("TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW", "trx");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("base58");
      expect(r.chain).toBe("tron");
    });

    it("accepts TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH", () => {
      const r = validateSync("TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH", "trx");
      expect(r.valid).toBe(true);
    });

    it("accepts TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9", () => {
      const r = validateSync("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9", "trx");
      expect(r.valid).toBe(true);
    });

    it("accepts TLeUZDGLWnz2Qfv64RDDDjN5uah7N2gSww", () => {
      const r = validateSync("TLeUZDGLWnz2Qfv64RDDDjN5uah7N2gSww", "trx");
      expect(r.valid).toBe(true);
    });

    it("accepts TRTCLHcJ8BjhdFKgDjfE9Ad5Z7dwJu5Zyk", () => {
      const r = validateSync("TRTCLHcJ8BjhdFKgDjfE9Ad5Z7dwJu5Zyk", "trx");
      expect(r.valid).toBe(true);
    });

    it("accepts trc20/usdt ticker", () => {
      const r = validateSync("TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW", "trc20/usdt");
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("tron");
    });

    it("accepts trc20/btc ticker (is Tron, not Bitcoin)", () => {
      const r = validateSync("TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW", "trc20/btc");
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("tron");
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "trx").valid).toBe(false);
    });

    it("rejects bad checksum (last char flipped)", () => {
      const r = validateSync("TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMX", "trx");
      expect(r.valid).toBe(false);
    });

    it("rejects a Bitcoin address", () => {
      const r = validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "trx");
      expect(r.valid).toBe(false);
    });

    it("rejects an address that is too short", () => {
      const r = validateSync("TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sx", "trx");
      expect(r.valid).toBe(false);
    });

    it("rejects an EVM address", () => {
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "trx");
      expect(r.valid).toBe(false);
    });
  });
});
