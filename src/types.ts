export type ChainName =
  | "bitcoin"
  | "bitcoinCash"
  | "litecoin"
  | "dogecoin"
  | "evm"
  | "tron"
  | "solana"
  | "monero"
  | "ripple"
  | "zcash"
  | "cardano"
  | "avalanche"
  | "near"
  | "aptos";

export type AddressType =
  | "p2pkh"
  | "p2sh"
  | "bech32"
  | "bech32m"
  | "cashaddr"
  | "eip55"
  | "base58"
  | "hex"
  | "sapling"
  | "shelley"
  | "implicit"
  | "named"
  | "monero-standard"
  | "monero-subaddress"
  | "monero-integrated";

export interface ValidationResult {
  valid: boolean;
  chain: ChainName;
  ticker: string;
  addressType?: AddressType;
  error?: string;
}

export interface ValidateOptions {
  /** For Solana: verify the decoded bytes are a valid Ed25519 point. Requires @noble/curves peer dep. Default: false */
  strictSolana?: boolean;
  /** Accept testnet addresses. Default: false */
  testnet?: boolean;
  /** For Bitcoin Cash: reject legacy Base58Check addresses, require CashAddr format. Default: false */
  requireCashAddr?: boolean;
}
