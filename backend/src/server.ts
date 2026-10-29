
import { createApp } from "./app.js";
import { bootstrap } from "./bootstrap.js";
import { assertEnv, env } from "./config/env.js";
import { controlPrisma } from "./lib/prisma.js";

async function main() {
  assertEnv();

  // Connect to the MAIN database (super admin and lab accounts) BEFORE accepting requests.
  // If this fails, nothing starts. Lab data and defaults live in each lab's own database
  // and are set up when the lab admin connects it (see setupLabDefaults in bootstrap.ts).
  await controlPrisma.$connect();
  await bootstrap();

  const server = createApp().listen(env.port, () =>
    console.log(`LabLIMS API running on http://localhost:${env.port}  (main database connected)`),
  );

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await controlPrisma.$disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));

main().catch(async (error) => {
  console.error("Could not start the server:", error);
  await controlPrisma.$disconnect().catch(() => undefined);
  process.exit(1);
});