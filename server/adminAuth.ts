import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { ENV } from "./_core/env";

const scrypt = promisify(scryptCallback);
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getSessionSecret() {
  if (ENV.cookieSecret) return ENV.cookieSecret;
  if (ENV.isProduction) throw new Error("JWT_SECRET is required for admin sessions");
  return "development-admin-session-secret";
}

export async function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("base64url")}`;
}

export async function verifyAdminPassword(password: string, storedHash: string | null) {
  if (!storedHash) return false;
  const [algorithm, salt, encodedHash] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !encodedHash) return false;
  const expected = Buffer.from(encodedHash, "base64url");
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createAdminSession(username: string) {
  const expiresAt = Date.now() + SESSION_MAX_AGE_MS;
  const payload = `${username}.${expiresAt}`;
  const signature = createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readAdminSession(token: string | undefined) {
  if (!token) return null;
  const [username, expiresAtText, signature] = token.split(".");
  const expiresAt = Number(expiresAtText);
  if (!username || !Number.isFinite(expiresAt) || expiresAt <= Date.now() || !signature) return null;
  const payload = `${username}.${expiresAtText}`;
  const expected = createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) return null;
  return username;
}

export const ADMIN_SESSION_MAX_AGE_MS = SESSION_MAX_AGE_MS;
