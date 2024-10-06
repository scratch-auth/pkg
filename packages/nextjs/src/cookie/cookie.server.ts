"use server";

import { cookies } from "next/headers";
import {
  RequestCookie,
  ResponseCookie,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";

export async function getAllCookie(): Promise<RequestCookie[]> {
  let res = cookies().getAll();
  return res;
}

export async function getCookie(
  name: string
): Promise<RequestCookie | undefined> {
  let res = cookies().get(name);
  return res;
}

export async function setCookie(
  ...args:
    | [key: string, value: string, cookie?: Partial<ResponseCookie>]
    | [options: ResponseCookie]
): Promise<ResponseCookies> {
  const res = cookies().set(...args);
  return res;
}

export async function hasCookie(name: string): Promise<boolean> {
  const res = cookies().has(name);
  return res;
}

export async function deleteCookie(name: string): Promise<ResponseCookies> {
  const res = cookies().delete(name);
  return res;
}
