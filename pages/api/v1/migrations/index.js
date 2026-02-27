import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandler);

async function getHandler(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions(dbClient),
      dryRun: true,
    });
    return res.status(200).json(pendingMigrations);
  } finally {
    if (dbClient) await dbClient.end();
  }
}

async function postHandler(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions(dbClient),
      dryRun: false,
    });
    if (migratedMigrations.length > 0)
      return res.status(201).json(migratedMigrations);
    return res.status(200).json(migratedMigrations);
  } finally {
    if (dbClient) await dbClient.end();
  }
}

function defaultMigrationOptions(dbClient) {
  return {
    dbClient,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}
