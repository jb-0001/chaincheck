import { describe, it, expect } from "vitest";
import { validateSync } from "../src/validate.js";

describe("Dogecoin address validation", () => {
  describe("valid P2PKH (D…)", () => {
    it("accepts DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L", () => {
      const r = validateSync("DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L", "doge");
      expect(r.valid).toBe(true);
      expect(r.addressType).toBe("p2pkh");
      expect(r.chain).toBe("dogecoin");
    });

    it("accepts DFpN6QqFfUmMnW34CjZ4FLqYsvg6UwwnyJ", () => {
      const r = validateSync("DFpN6QqFfUmMnW34CjZ4FLqYsvg6UwwnyJ", "doge");
      expect(r.valid).toBe(true);
    });

    it("accepts DLd5sVBDGsX315SeN415An6YXTcvRbso7A", () => {
      const r = validateSync("DLd5sVBDGsX315SeN415An6YXTcvRbso7A", "doge");
      expect(r.valid).toBe(true);
    });

    it("accepts DMbDViy1z4gweDFaYCyayvnPFUERB5Hymk", () => {
      const r = validateSync("DMbDViy1z4gweDFaYCyayvnPFUERB5Hymk", "doge");
      expect(r.valid).toBe(true);
    });

    it("accepts DHh2vimDCkdpZqMRVtcr8CLWPZeXYBVYcL", () => {
      const r = validateSync("DHh2vimDCkdpZqMRVtcr8CLWPZeXYBVYcL", "doge");
      expect(r.valid).toBe(true);
    });
  });

  describe("invalid addresses", () => {
    it("rejects empty string", () => {
      expect(validateSync("", "doge").valid).toBe(false);
    });

    it("rejects bad checksum (last char flipped)", () => {
      const r = validateSync("DH5yaieqoZN36fDVciNyRueRGvGLR3mr7K", "doge");
      expect(r.valid).toBe(false);
    });

    it("rejects a Bitcoin address", () => {
      const r = validateSync("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "doge");
      expect(r.valid).toBe(false);
    });

    it("rejects an address that is too short", () => {
      const r = validateSync("DABC", "doge");
      expect(r.valid).toBe(false);
    });

    it("rejects an EVM address", () => {
      const r = validateSync("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "doge");
      expect(r.valid).toBe(false);
    });
  });
});
