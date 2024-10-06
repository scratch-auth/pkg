"use client";

import { useEffect, useState } from "react";
import { getSession } from "../server";
import { Session } from "../types";
import { ResponseProps } from "../types";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await getSession(); // サーバーからセッションを取得

        // `ResponseProps` 型のエラーハンドリング
        if ((res as ResponseProps).status !== undefined) {
          // res が ResponseProps 型である場合
          const errorResponse = res as ResponseProps;
          setError(errorResponse.message);
          setSession(null); // セッションは null に設定
        } else {
          // res が Session 型である場合
          setSession(res as Session);
          setError(null); // エラーをクリア
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setError("Failed to fetch session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { session, loading, error };
}
