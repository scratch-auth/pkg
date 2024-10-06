"use client";

import React from "react";
import { ScratchAuthLogin, ScratchAuthLogout } from "../server";
import { useRouter } from "next/navigation";
import pkgConfig from "../pkgConfig";
import { eventDispatch } from "../cookie/dispatchEvent";

export interface LogInButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}
export const LogInButton = React.forwardRef<
  HTMLButtonElement,
  LogInButtonProps
>(({ children, className, ...props }, ref) => {
  const handleClick = async () => {
    const success = await ScratchAuthLogin(); // ログイン処理を実行
    if (!success) {
      eventDispatch(new Event("sah-sessionchange"));
      if (pkgConfig.debug) {
        console.log("Login failed");
      }
    }
  };

  return (
    <button
      className={pkgConfig.cn("", className)}
      ref={ref}
      {...props}
      onClick={handleClick}
    >
      {children || "Log in"}
    </button>
  );
});
LogInButton.displayName = "LogInButton";

export interface LogOutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}
export const LogOutButton = React.forwardRef<
  HTMLButtonElement,
  LogOutButtonProps
>(({ children, className, ...props }, ref) => {
  const router = useRouter();
  const handleClick = async () => {
    if (pkgConfig.debug) {
      console.log("Logged out");
    }
    await ScratchAuthLogout(); // ログアウト処理を実行
    eventDispatch(new Event("sah-sessionchange"));
    router.refresh();
  };

  return (
    <button
      className={pkgConfig.cn("", className)}
      ref={ref}
      {...props}
      onClick={handleClick}
    >
      {children || "Log Out"}
    </button>
  );
});
LogOutButton.displayName = "LogOutButton";
