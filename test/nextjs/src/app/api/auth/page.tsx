"use client";
 
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setScratchAuthSession } from "@scratch-auth/nextjs";
 
export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const privateCode = searchParams.get("privateCode");
 
  useEffect(() => {
    async function auth() {
      console.log(privateCode);
      const check = await setScratchAuthSession(privateCode);
      console.log("check", check);
      if (check) {
        console.log("認証に成功しました");
      } else {
        console.error("認証に失敗しました");
      }
      router.push("/");
    }
    auth();
  }, [privateCode]);
 
  return (
    <div className="flex justify-center items-center w-full h-full min-h-[calc(100dvh-64px)]">
      Scratchアカウントを認証中...
    </div>
  );
}