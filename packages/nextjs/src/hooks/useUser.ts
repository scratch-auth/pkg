"use client";

import { useEffect, useState, useCallback } from "react";
import { currentUser } from "../server";
import { User } from "../types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const fetchedUser = await currentUser();
    setUser(fetchedUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser(); // 初回ロード時にユーザー情報を取得
  }, [fetchUser]);

  // `refreshUser`としてユーザー情報を再取得する関数を返す
  return { user, loading, refreshUser: fetchUser };
}
