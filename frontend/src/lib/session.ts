import { queryClient } from "@/api/client";
import { UserSchema } from "@/api/generated";
import { z } from "zod";

export function invalidateSession(user?: UserSchema | null) {
  if (user === undefined) {
    localStorage.removeItem("user");
    queryClient.invalidateQueries({ queryKey: ["verify"] });
  } else if (user === null) {
    localStorage.setItem("user", "null");
    queryClient.setQueryData(["verify"], null);
  } else {
    localStorage.setItem("user", JSON.stringify(user));
    queryClient.setQueryData(["verify"], user);
  }
}

const userSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    type: z.enum(["mahasiswa", "ota", "admin"]),
  })
  .nullable();

export function loadUserCache() {
  const queryClientUser = queryClient.getQueryData<UserSchema | null>([
    "verify",
  ]);
  if (queryClientUser !== undefined) {
    return queryClientUser;
  }
  try {
    const user = localStorage.getItem("user");
    if (!user) return undefined;
    return userSchema.parse(JSON.parse(user)) as UserSchema;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export function tryToLoadUserLocalStorage() {
  const user = localStorage.getItem("user");
  if (!user) {
    throw new Error("User not found");
  }
  return userSchema.parse(JSON.parse(user)) as UserSchema;
}

export function saveUserCache(user: UserSchema | null) {
  localStorage.setItem("user", JSON.stringify(user));
}
