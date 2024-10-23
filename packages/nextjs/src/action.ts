"use server";

import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import pkgConfig from "./pkgConfig";
import { deleteCookie, getCookie, setCookie } from "./cookie/cookie.server";

const secretKey = process.env.SCRATCH_AUTH_SECRET_KEY!;
if (!secretKey) {
  throw new Error("SCRATCH_AUTH_SECRET_KEY is not defined!");
}

// セッションIDを生成
export async function generateScratchAuthSessionId(): Promise<string> {
  return uuidv4();
}

// HMACを計算する関数
export async function ScratchAuthCalculateHmac(text: string): Promise<string> {
  return crypto.createHmac("sha256", secretKey).update(text).digest("hex");
}

// AES-GCMを使って文字列を暗号化
export async function ScratchAuthEncrypt(text: string): Promise<string> {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(secretKey, "hex"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

// AES-GCMを使って文字列を復号化
export async function ScratchAuthDecrypt(text: string): Promise<string | null> {
  try {
    const [iv, encrypted, authTag] = text.split(":");
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(secretKey, "hex"),
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    if (pkgConfig.debug) {
      console.warn("Decryption failed:", error);
    }
    await deleteCookie(pkgConfig.COOKIE_NAME);
    return null;
  }
}

// トークンの検証
export async function ScratchAuthVerifyToken(
  privateCode: string
): Promise<any> {
  try {
    if (pkgConfig.debug) {
      console.log("Private Code:", privateCode);
    }
    const res = await fetch(
      `https://auth.itinerary.eu.org/api/auth/verifyToken?privateCode=${privateCode}`
    );
    const data = await res.json();
    if (pkgConfig.debug) {
      console.log("Token Verification Response:", data);
    }
    if (data.valid === true && data.redirect === pkgConfig.redirect_url) {
      let sessionId = crypto.randomUUID();
      return JSON.stringify({ sessionId, data });
    }
  } catch (error) {
    console.error("ScratchAuthVerifyToken Error:", error);
  }
}

// セッションデータを暗号化してCookieに保存
export async function setScratchAuthEncryptedData(
  content: string,
  value: string,
  days: number
): Promise<void> {
  const hmac = await ScratchAuthCalculateHmac(value);
  const encryptedValue = await ScratchAuthEncrypt(value + "|" + hmac);
  const expires = new Date();
  if (days === -1) {
    expires.setFullYear(expires.getFullYear() + 200);
  } else {
    expires.setDate(expires.getDate() + days);
  }

  await setCookie({
    name: content,
    value: encryptedValue,
    expires: expires,
    path: "/",
  });
}

// CookieからセッションIDを取得し、検証してから復号化
export async function getScratchAuthDecryptedSessionId(
  content: string
): Promise<string | null> {
  const encryptedValue = await getCookie(content);
  if (encryptedValue) {
    const decryptedValue = await ScratchAuthDecrypt(encryptedValue.value);
    if (decryptedValue) {
      const [sessionId, hmac] = decryptedValue.split("|");
      const calculatedHmac = await ScratchAuthCalculateHmac(sessionId);
      if (calculatedHmac === hmac) {
        return sessionId;
      } else {
        if (pkgConfig.debug) {
          console.warn("HMAC does not match. Deleting cookie.");
        }
        await deleteCookie(content);
      }
    } else {
      if (pkgConfig.debug) {
        console.warn("Decryption failed. Deleting cookie.");
      }
    }
  }
  return null;
}

// ユーザー名とIVを取得する関数
export async function getScratchAuthUserName(
  content: string
): Promise<string | null> {
  const encryptedValue = await getCookie(content);
  if (encryptedValue) {
    const decrypted = await ScratchAuthDecrypt(encryptedValue.value);
    if (decrypted) {
      const [username] = decrypted.split("|");
      return username;
    } else {
      if (pkgConfig.debug) {
        console.warn("Decryption failed. Deleting cookie.");
      }
    }
  }
  await deleteCookie(content);
  return null;
}
