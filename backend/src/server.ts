import { createApp } from "./app.js";
import { bootstrap } from "./bootstrap.js";
import { assertEnv, env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

async function main() {
  assertEnv();

  // Connect to MySQL BEFORE accepting requests. If this fails, nothing starts.
  await bootstrap();

  const server = createApp().listen(env.port, () =>
    console.log(`LabLIMS API running on http://localhost:${env.port}  (database connected)`),
  );

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));

main().catch(async (error) => {
  console.error("Could not start the server:", error instanceof Error ? error.message : error);
  await prisma.$disconnect().catch(() => undefined);
  process.exit(1);
});
