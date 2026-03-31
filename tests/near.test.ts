import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("NEAR Protocol address validation", () => {
  describe("valid implicit accounts (64 hex chars)", () => {
    it("accepts a 64-char lowercase hex address", () => {
      const r = validateSync(
        "98793cd91a3f870fb126f66285808c7e094afcfc4eda8a970f6648cdf0dbd6de",
        "near"
      );
      expect(r.valid).toBe(true);
      expect(r.chain).toBe("near");
      expect(r.addressType).toBe("implicit");
    });

    it("accepts another implicit address", () => {
      const r = validateSync(
        "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "near"
      );
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("implicit");
    });
  });

  describe("valid named accounts", () => {
    it("accepts 'alice.near'", () => {
      const r = validateSync("alice.near", "near");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("named");
    });

    it("accepts 'bob.testnet'", () => {
      const r = validateSync("bob.testnet", "near");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("named");
    });

    it("accepts sub-account 'app.alice.near'", () => {
      const r = validateSync("app.alice.near", "near");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("named");
    });

    it("accepts account with hyphen and underscore", () => {
      const r = validateSync("my-wallet_1.near", "near");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("named");
    });

    it("accepts a 2-character account", () => {
      const r = validateSync("ab", "near");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("named");
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "near").valid).toBe(false);
    });

    it("rejects a single character", () => {
      expect(validateSync("a", "near").valid).toBe(false);
    });

    it("rejects uppercase in implicit address", () => {
      // 64 chars but contains uppercase (not lowercase hex)
      expect(
        validateSync(
          "98793CD91A3F870FB126F66285808C7E094AFCFC4EDA8A970F6648CDF0DBD6DE",
          "near"
        ).valid
      ).toBe(false);
    });

    it("rejects account starting with hyphen", () => {
      expect(validateSync("-alice.near", "near").valid).toBe(false);
    });

    it("rejects account ending with hyphen", () => {
      expect(validateSync("alice-.near", "near").valid).toBe(false);
    });

    it("rejects account with uppercase letter", () => {
      expect(validateSync("Alice.near", "near").valid).toBe(false);
    });

    it("rejects address longer than 64 chars (not implicit hex)", () => {
      expect(
        validateSync("a".repeat(65), "near").valid
      ).toBe(false);
    });

    it("rejects an EVM address", () => {
      expect(
        validateSync("0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "near").valid
      ).toBe(false);
    });
  });

  describe("chain name passthrough", () => {
    it("works with chain name 'near'", () => {
      const r = validateSync("alice.near", "near");
      expect(r.valid).toBe(true);
    });
  });
});
