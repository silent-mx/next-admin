"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const authenticate = async (data: Record<string, any>) => {
  try {
    await signIn("credentials", data);
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error(error.cause?.err?.message);
    } else {
      throw error;
    }
  }
};
