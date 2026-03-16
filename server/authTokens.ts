import { randomBytes } from "crypto";

interface TokenData {
  username: string;
  expires: number;
}

const tokens = new Map<string, TokenData>();

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function createToken(username: string): string {
  const token = randomBytes(32).toString("hex");
  tokens.set(token, { username, expires: Date.now() + TOKEN_TTL_MS });
  return token;
}

export function validateToken(token: string): TokenData | null {
  const data = tokens.get(token);
  if (!data) return null;
  if (data.expires < Date.now()) {
    tokens.delete(token);
    return null;
  }
  return data;
}

export function deleteToken(token: string): void {
  tokens.delete(token);
}
