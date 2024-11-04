"use client";

import React from "react";
import { useUser } from "../hooks/useUser";

type ConfigProps = {
  noLogin: {
    redirect?: string;
    function?: () => void;
    children?: React.ReactNode;
  };
};

export interface ScratchAuthProviderProps {
  children: React.ReactNode;
  config?: ConfigProps;
}

const ScratchAuthProvider = ({
  children,
  config = {
    noLogin: {
      redirect: "/",
    },
  },
}: ScratchAuthProviderProps) => {
  const { user, loading, refreshUser } = useUser();

  React.useEffect(() => {
    const handleCookieChange = () => {
      refreshUser(); // クッキーが変化した際にユーザー情報を更新
    };

    if (typeof window !== undefined) {
      window.addEventListener("sah-sessionchange", handleCookieChange); // クッキーの変化を監視

      return () => {
        window.removeEventListener("sah-sessionchange", handleCookieChange); // クリーンアップ
      };
    }
  }, [refreshUser]);

  if (loading) {
    return <>{config?.noLogin.children}</> || null;
  }

  if (!user) {
    if (config?.noLogin.redirect && typeof window !== undefined) {
      window.location.href = config?.noLogin.redirect;
      return null;
    }
    if (config?.noLogin.function) {
      config?.noLogin.function();
    }
    return <>{config?.noLogin.children}</> || null;
  }
  return <>{children}</>;
};
ScratchAuthProvider.displayName = "ScratchAuthProvider";

export default ScratchAuthProvider;
