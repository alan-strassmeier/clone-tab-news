import migrationRunner from "node-pg-migrate";
import { resolve } from "path";
import database from "infra/database.js";

function defaultMigrationOptions(dbClient) {
  return {
    dbClient,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions(dbClient),
      dryRun: true,
    });
    return pendingMigrations;
  } finally {
    if (dbClient) await dbClient.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions(dbClient),
      dryRun: false,
    });
    return migratedMigrations;
  } finally {
    if (dbClient) await dbClient.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
