import { describe, it, expect } from "vitest";
import {
  getChainForTicker,
  getSupportedTickers,
  TICKER_MAP,
} from "../src/tickers.js";

describe("Ticker → chain mapping", () => {
  describe("every ticker resolves to a chain", () => {
    const tickers = getSupportedTickers();

    it("returns a non-empty list of tickers", () => {
      expect(tickers.length).toBeGreaterThan(80);
    });

    tickers.forEach((ticker) => {
      it(`resolves "${ticker}"`, () => {
        expect(getChainForTicker(ticker)).toBeDefined();
      });
    });
  });

  describe("chain passthrough", () => {
    it("accepts 'bitcoin' as a chain name", () => {
      expect(getChainForTicker("bitcoin")).toBe("bitcoin");
    });

    it("accepts 'evm' as a chain name", () => {
      expect(getChainForTicker("evm")).toBe("evm");
    });

    it("accepts 'solana' as a chain name", () => {
      expect(getChainForTicker("solana")).toBe("solana");
    });
  });

  describe("case insensitivity", () => {
    it("resolves 'ETH' (uppercase)", () => {
      expect(getChainForTicker("ETH")).toBe("evm");
    });

    it("resolves 'BTC' (uppercase)", () => {
      expect(getChainForTicker("BTC")).toBe("bitcoin");
    });
  });

  describe("critical ticker mappings (non-obvious chain assignments)", () => {
    it("bep20/ltc → evm (NOT litecoin)", () => {
      expect(getChainForTicker("bep20/ltc")).toBe("evm");
    });

    it("trc20/btc → tron (NOT bitcoin)", () => {
      expect(getChainForTicker("trc20/btc")).toBe("tron");
    });

    it("sol/sol → solana", () => {
      expect(getChainForTicker("sol/sol")).toBe("solana");
    });

    it("trc20/usdt → tron", () => {
      expect(getChainForTicker("trc20/usdt")).toBe("tron");
    });

    it("erc20/usdt → evm", () => {
      expect(getChainForTicker("erc20/usdt")).toBe("evm");
    });

    it("bep20/usdt → evm", () => {
      expect(getChainForTicker("bep20/usdt")).toBe("evm");
    });

    it("arbitrum/usdc → evm", () => {
      expect(getChainForTicker("arbitrum/usdc")).toBe("evm");
    });

    it("avax-c/avax → evm", () => {
      expect(getChainForTicker("avax-c/avax")).toBe("evm");
    });
  });

  describe("unknown tickers", () => {
    it("returns undefined for an unknown ticker", () => {
      expect(getChainForTicker("xyz_not_a_coin")).toBeUndefined();
    });

    it("returns undefined for an empty string", () => {
      expect(getChainForTicker("")).toBeUndefined();
    });

    it("returns undefined for a made-up ticker", () => {
      expect(getChainForTicker("fakecoin/token")).toBeUndefined();
    });
  });

  describe("all required tickers are present", () => {
    const required = [
      "btc", "bch", "ltc", "doge", "eth", "trx",
      "erc20/usdt", "erc20/usdc", "erc20/dai", "erc20/link",
      "bep20/usdt", "bep20/usdc", "bep20/bnb", "bep20/ltc",
      "arbitrum/eth", "arbitrum/usdc",
      "polygon/usdc", "polygon/usdt",
      "avax-c/avax", "avax-c/usdc",
      "base/eth", "base/usdc",
      "optimism/eth", "optimism/usdc",
      "linea/eth", "linea/usdc",
      "monad/mon",
      "trc20/usdt", "trc20/btc",
      "sol/sol", "sol/usdc", "sol/usdt",
    ];

    required.forEach((ticker) => {
      it(`includes "${ticker}"`, () => {
        expect(ticker in TICKER_MAP).toBe(true);
      });
    });
  });
});
