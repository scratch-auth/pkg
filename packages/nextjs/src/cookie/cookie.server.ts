"use server";

import { cookies } from "next/headers";
import {
  RequestCookie,
  ResponseCookie,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";

export async function getAllCookie(): Promise<RequestCookie[]> {
  const cookieStore = await cookies();
  let res = cookieStore.getAll();
  return res;
}

export async function getCookie(
  name: string
): Promise<RequestCookie | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}

export async function setCookie(
  ...args:
    | [key: string, value: string, cookie?: Partial<ResponseCookie>]
    | [options: ResponseCookie]
): Promise<ResponseCookies> {
  const cookieStore = await cookies();
  return cookieStore.set(...args);
}

export async function hasCookie(name: string): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(name);
}

export async function deleteCookie(name: string): Promise<ResponseCookies> {
  const cookieStore = await cookies();
  return cookieStore.delete(name);
}
