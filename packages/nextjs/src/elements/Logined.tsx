"use client";

import React from "react";
import { useUser } from "../hooks/useUser";

interface LogInedProps extends React.AllHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export const LogIned: React.FC<LogInedProps> = ({ children }) => {
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
    return null;
  }

  if (!user) {
    return null;
  }
  return <>{children}</>;
};

interface LogOutedProps extends React.AllHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export const LogOuted: React.FC<LogOutedProps> = ({ children }) => {
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
    return null;
  }

  if (user) {
    return null;
  }
  return <>{children}</>;
};
