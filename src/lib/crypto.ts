import { SignJWT, jwtVerify } from "jose"

const secret = process.env.JWT_SECRET || "dev-secret"
const key = new TextEncoder().encode(secret)

export async function encrypt(payload: object) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // expires in 7 days
    .sign(key)
}

export async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, key)
  return payload
}
