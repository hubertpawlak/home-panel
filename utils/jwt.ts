// Licensed under the Open Software License version 3.0
import type { KeyLike } from "jose";
import {
  base64url,
  exportPKCS8,
  exportSPKI,
  importPKCS8,
  importSPKI,
} from "jose";
import { JwtAlg } from "../types/JwtAlg";

export async function base64ToJwtPublicKey(encodedJwtPublicKey?: string) {
  // Check if the key is provided
  if (!encodedJwtPublicKey) return;
  // Decode from base64
  const publicKeyString = base64url.decode(encodedJwtPublicKey).toString();
  // Import
  const publicKey = await importSPKI(publicKeyString, JwtAlg);
  return publicKey;
}

export async function base64ToJwtPrivateKey(encodedJwtPrivateKey?: string) {
  if (!encodedJwtPrivateKey) return;
  const privateKeyString = base64url.decode(encodedJwtPrivateKey).toString();
  const privateKey = await importPKCS8(privateKeyString, JwtAlg);
  return privateKey;
}

export async function jwtPublicKeyToBase64(jwtPublicKey: KeyLike) {
  // Check if key is provided
  if (!jwtPublicKey) return;
  // Export to a string
  const publicKeyString = await exportSPKI(jwtPublicKey);
  // Encode as base64 for easy storage in .env
  const encodedPublicKey = base64url.encode(publicKeyString);
  return encodedPublicKey;
}

export async function jwtPrivateKeyToBase64(jwtPrivateKey: KeyLike) {
  if (!jwtPrivateKey) return;
  const privateKeyString = await exportPKCS8(jwtPrivateKey);
  const encodedPrivateKey = base64url.encode(privateKeyString);
  return encodedPrivateKey;
}
