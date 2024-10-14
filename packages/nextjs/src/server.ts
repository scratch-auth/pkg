"use server";

import { redirect } from "next/navigation";
import {
  getScratchAuthUserName,
  ScratchAuthDecrypt,
  ScratchAuthVerifyToken,
  setScratchAuthEncryptedData,
} from "./action";
import { deleteCookie, getCookie } from "./cookie/cookie.server";
import pkgConfig from "./pkgConfig";
import { getUser } from "./scratch.api";
import { ResponseProps, Session, User } from "./types";

// エラーハンドリング関数を共通化
function createErrorResponse(
  status: number,
  code: string,
  message: string
): ResponseProps {
  return { status, code, message };
}

// セッションが存在するか確認
async function checkSession(): Promise<Session | null> {
  const session = await getCookie(pkgConfig.COOKIE_NAME);
  return session?.value ? ScratchAuthDecrypt(session.value) : null; // セッションが存在すれば復号化して返す
}

export async function getUserName(): Promise<Session | null> {
  return getScratchAuthUserName(pkgConfig.COOKIE_NAME);
}

// 現在のユーザーを取得
export async function currentUser(): Promise<User | null> {
  const session = await getUserName(); // セッションを取得

  if (!session) {
    return null; // セッションが存在しない場合はnullを返す
  }

  try {
    const user = await getUser(session); // ユーザー情報を取得
    return user; // ユーザーオブジェクトを返す
  } catch (error) {
    console.error("Error in currentUser:", error);
    return null; // エラーが発生した場合もnullを返す
  }
}

// セッションを取得
export async function getSession(): Promise<Session | ResponseProps> {
  const session = await checkSession();

  if (!session) {
    return createErrorResponse(404, "NotFound", "Session is not defined");
  }

  return session; // 復号化されたセッションを返す
}

// セッションを設定
export async function setScratchAuthSession(
  privateCode: Session
): Promise<boolean> {
  if (!privateCode) {
    if (pkgConfig.debug) {
      console.warn("setScratchAuthSession: privateCode is null");
    }
    return false;
  }

  try {
    const res = await ScratchAuthVerifyToken(privateCode);
    if (!res) {
      if (pkgConfig.debug) {
        console.error("Invalid token response during session setup.");
      }
      return false;
    }

    const obj = JSON.parse(res);
    if (!obj.data?.username) {
      if (pkgConfig.debug) {
        console.error("Username missing from token response.");
      }
      return false;
    }

    await setScratchAuthEncryptedData(
      pkgConfig.COOKIE_NAME,
      obj.data.username,
      pkgConfig.expiration
    );
    return true;
  } catch (error) {
    console.error("setScratchAuthSession Error:", error);
    return false;
  }
}

// ログイン処理
export async function ScratchAuthLogin(): Promise<boolean> {
  const session = await checkSession();
  if (session) {
    return false; // ログイン済みの場合はリダイレクトしない
  }

  const redirectLocation = btoa(pkgConfig.redirect_url); // Base64エンコード
  redirect(
    `https://auth.itinerary.eu.org/auth/?redirect=${redirectLocation}&name=${pkgConfig.title}`
  );
}

// ログアウト処理
export async function ScratchAuthLogout(): Promise<void> {
  await deleteCookie(pkgConfig.COOKIE_NAME);
  redirect("/"); // ホームページにリダイレクト
}

// ログインしているかどうか確認
export async function isLoggedIn(): Promise<boolean> {
  const session = await checkSession();
  return !!session; // セッションが存在する場合はtrue
}

// リダイレクト後の状態を確認
export async function checkRedirectState(): Promise<boolean> {
  const session = await checkSession();
  return !!session; // ログイン済みかどうか
}
