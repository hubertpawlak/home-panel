// Licensed under the Open Software License version 3.0
import { expect, test } from "@jest/globals";
import { generateKeyPair } from "jose";
import { nanoid } from "nanoid/non-secure";
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
  expect(decodedPublicKey).toMatchObject(publicKey);

  const encodedPrivateKey = await jwtPrivateKeyToBase64(privateKey);
  expect(encodedPrivateKey).toBeDefined();
  const decodedPrivateKey = await base64ToJwtPrivateKey(encodedPrivateKey);
  expect(decodedPrivateKey).toMatchObject(privateKey);
});

test("fails to decode random strings", async () => {
  const encodedPublicKey = nanoid();
  const encodedPrivateKey = nanoid();

  const decodedPublicKey = await base64ToJwtPublicKey(encodedPublicKey).catch(
    () => {}
  );
  expect(decodedPublicKey).toBeUndefined();

  const decodedPrivateKey = await base64ToJwtPrivateKey(
    encodedPrivateKey
  ).catch(() => {});
  expect(decodedPrivateKey).toBeUndefined();
});
