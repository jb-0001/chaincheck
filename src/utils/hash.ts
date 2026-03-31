import { createHash } from "node:crypto";
import { keccak_256 } from "@noble/hashes/sha3";

export function sha256(data: Uint8Array): Uint8Array {
  return new Uint8Array(createHash("sha256").update(data).digest());
}

export function sha256d(data: Uint8Array): Uint8Array {
  return sha256(sha256(data));
}

export function keccak256(data: Uint8Array): Uint8Array {
  return keccak_256(data);
}
