"use server";

import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { deleteCookie, getCookie, setCookie } from "./cookie/cookie.server";
import pkgConfig from "./pkgConfig";

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

// AES暗号化を使って文字列を暗号化
export async function ScratchAuthEncrypt(text: string): Promise<string> {
  const iv = crypto.randomBytes(16); // 初期化ベクトル
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // IVと暗号文を結合
}

// AES復号化を使って文字列を復号化
export async function ScratchAuthDecrypt(text: string): Promise<string> {
  const [iv, encrypted] = text.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
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
  const hmac = await ScratchAuthCalculateHmac(value); // HMACを計算
  const encryptedValue = await ScratchAuthEncrypt(value + "|" + hmac); // データとHMACを結合し、暗号化
  const expires = new Date();
  if (days === -1) {
    expires.setFullYear(expires.getFullYear() + 200); // 有効期限を200年後に設定
  } else {
    expires.setDate(expires.getDate() + days); // 指定日数後に期限切れに
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
  const encryptedValue = await getCookie(content); // Cookieから値を取得
  if (encryptedValue) {
    try {
      const decryptedValue = await ScratchAuthDecrypt(encryptedValue.value); // 復号化を試みる
      const [sessionId, hmac] = decryptedValue.split("|"); // セッションIDとHMACに分割
      const calculatedHmac = await ScratchAuthCalculateHmac(sessionId); // HMACを再計算
      if (calculatedHmac === hmac) {
        return sessionId; // 検証が成功した場合はセッションIDを返す
      } else {
        console.warn("HMAC does not match. Deleting cookie.");
        await deleteCookie(content); // HMACが一致しない場合、Cookieを削除
      }
    } catch (error) {
      console.error("Error during decryption:", error);
      await deleteCookie(content); // 復号化に失敗した場合、Cookieを削除
    }
  }
  return null;
}

// ユーザー名とIVを取得する新しい関数を作成
export async function getScratchAuthUserName(
  content: string
): Promise<string | null> {
  const encryptedValue = await getCookie(content); // Cookieから値を取得
  if (encryptedValue) {
    try {
      const decrypted = await ScratchAuthDecrypt(encryptedValue.value); // 復号化
      const [username] = decrypted.split("|"); // ユーザー名を取得
      return username; // ユーザー名を返す
    } catch (error) {
      console.error("Error during decryption:", error);
      await deleteCookie(content); // 復号化に失敗した場合、Cookieを削除
    }
  }
  return null;
}
