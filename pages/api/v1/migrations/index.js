import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import migrator from "models/migrator.js";
const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandler);

async function getHandler(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return res.status(200).json(pendingMigrations);
}
async function postHandler(req, res) {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return res.status(201).json(migratedMigrations);
  }
  return res.status(200).json(migratedMigrations);
}
