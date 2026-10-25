import "dotenv/config";

/** All settings come from backend/.env. Read them here, nowhere else. */
const list = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  /** First owner account. Created once on startup if that e-mail has no user yet. */
  adminEmail: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ?? "",
  adminName: process.env.ADMIN_NAME ?? "Lab Owner",
  /** Comma separated list. Empty = allow any origin (fine for local development). */
  corsOrigins: list(process.env.CORS_ORIGIN),
  /** Used to decide what "today" means and to group money by day. */
  timezone: process.env.APP_TIMEZONE ?? "Asia/Kolkata",
};

/** Stops the server at startup, with a readable message, if .env is incomplete. */
export function assertEnv(): void {
  const problems: string[] = [];

  if (!env.databaseUrl) problems.push("DATABASE_URL is missing.");

  if (env.jwtSecret.length < 32) {
    problems.push("JWT_SECRET must be set and at least 32 characters long.");
  }

  if (problems.length) {
    throw new Error(
      `Invalid backend/.env:\n - ${problems.join("\n - ")}\nSee backend/.env.example.`,
    );
  }
}
