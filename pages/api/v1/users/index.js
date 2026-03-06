import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandler);

async function postHandler(req, res) {
  const userIputValue = req.body;
  const newUser = await user.create(userIputValue);
  return res.status(201).json(newUser);
}
