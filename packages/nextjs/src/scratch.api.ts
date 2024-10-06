"use server";

import { User } from "./types";

export async function getUser(username: string): Promise<User | null> {
  try {
    const response = await fetch(
      `https://api.scratch.mit.edu/users/${username}`
    );
    if (!response.ok) {
      return null;
    }
    const user: User = await response.json();
    if (!user.username) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error in getUser:", error);
    return null;
  }
}
