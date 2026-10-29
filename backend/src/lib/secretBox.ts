import crypto from "node:crypto";

/** Encrypts small secrets (database URLs) with AES-256-GCM. The key comes from TENANT_SECRET. */
function key(): Buffer {
  const secret = process.env.TENANT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("TENANT_SECRET must be set in .env (at least 32 random characters).");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

export function encrypt(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((part) => part.toString("base64")).join(".");
}

export function decrypt(payload: string): string {
  const [iv, tag, data] = payload.split(".").map((part) => Buffer.from(part, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv!);
  decipher.setAuthTag(tag!);
  return Buffer.concat([decipher.update(data!), decipher.final()]).toString("utf8");
}