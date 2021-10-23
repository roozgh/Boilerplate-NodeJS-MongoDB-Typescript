import Router from "koa-router";
import auth from "../api/auth/route";
import user from "../api/user/route";
import file from "../api/file/route";
import { Context } from "koa";

const router = new Router();

router.get("/health", (ctx: Context) => {
  ctx.response.body = "OK";
  ctx.status = 200;
});

router.use(auth, user, file);

export default router.routes();
