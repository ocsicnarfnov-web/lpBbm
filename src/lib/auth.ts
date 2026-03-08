import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "broiler-breeder-management-secret-key-2024"
);

export interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "supervisor" | "worker";
}

export async function createToken(payload: UserPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSession(user: UserPayload): Promise<void> {
  const token = await createToken(user);
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

export function hasPermission(
  userRole: string,
  requiredRole: "admin" | "manager" | "supervisor" | "worker"
): boolean {
  const roleHierarchy = { admin: 4, manager: 3, supervisor: 2, worker: 1 };
  return (
    roleHierarchy[userRole as keyof typeof roleHierarchy] >=
    roleHierarchy[requiredRole]
  );
}
