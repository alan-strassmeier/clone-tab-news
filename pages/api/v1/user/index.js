import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
import session from "models/session";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandler);

async function getHandler(req, res) {
  const sessionToken = req.cookies.session_id;

  const sessionObjct = await session.findOneValidByToken(sessionToken);
  const renewedSessionObjct = await session.renew(sessionObjct.id);
  controller.setSessionCookie(renewedSessionObjct.token, res);

  const userFount = await user.findOneById(sessionObjct.user_id);

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0",
  );
  return res.status(200).json(userFount);
}
