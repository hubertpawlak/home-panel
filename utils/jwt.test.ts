// Licensed under the Open Software License version 3.0
import { expect, test } from "@jest/globals";
import { generateKeyPair } from "jose";
import { JwtAlg } from "../types/JwtAlg";
import {
  base64ToJwtPrivateKey,
  base64ToJwtPublicKey,
  jwtPrivateKeyToBase64,
  jwtPublicKeyToBase64,
} from "./jwt";

test("JwtAlg is ES512", async () => {
  expect(JwtAlg).toBe("ES512");
});

test("encodes and decodes JWT keys", async () => {
  const { publicKey, privateKey } = await generateKeyPair(JwtAlg);

  const encodedPublicKey = await jwtPublicKeyToBase64(publicKey);
  expect(encodedPublicKey).toBeDefined();
  const decodedPublicKey = await base64ToJwtPublicKey(encodedPublicKey);
  expect(decodedPublicKey).toHaveProperty("type", publicKey.type);

  const encodedPrivateKey = await jwtPrivateKeyToBase64(privateKey);
  expect(encodedPrivateKey).toBeDefined();
  const decodedPrivateKey = await base64ToJwtPrivateKey(encodedPrivateKey);
  expect(decodedPrivateKey).toHaveProperty("type", privateKey.type);
});

test("fails to decode random strings", async () => {
  const encodedPublicKey = "random string";
  const encodedPrivateKey = "random string";

  const decodedPublicKey = await base64ToJwtPublicKey(encodedPublicKey).catch(
    () => {}
  );
  expect(decodedPublicKey).toBeUndefined();

  const decodedPrivateKey = await base64ToJwtPrivateKey(
    encodedPrivateKey
  ).catch(() => {});
  expect(decodedPrivateKey).toBeUndefined();
});
