import { getUserFromCookie } from "@/lib/auth"

export async function getCurrentUser() {
  return await getUserFromCookie()
}
