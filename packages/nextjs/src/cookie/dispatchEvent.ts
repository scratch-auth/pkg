"use client";

export function eventDispatch(event: Event): boolean {
  if (typeof window !== "undefined") {
    const res = window.dispatchEvent(event);
    return res;
  }
  return false;
}
