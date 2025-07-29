import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key")
const alg = "HS256"

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}

export async function getUserFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  try {
    return await decrypt(token)
  } catch (err) {
    return null
  }
}
