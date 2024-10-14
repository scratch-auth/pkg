import { ScratchAuthConfig } from "@scratch-auth/nextjs/src/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const config: ScratchAuthConfig = {
  COOKIE_NAME: "scratch-auth-session",
  redirect_url: `http://localhost:3000/api/auth`,
  title: `Scratch Auth`,
  expiration: 30,
  cn: function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  },
  debug: true,
};

export default config;
