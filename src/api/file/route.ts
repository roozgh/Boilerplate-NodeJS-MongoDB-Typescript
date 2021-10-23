import Router from "koa-router";
import { verify } from "../../middlewares/jwt";
import { FileController as ctr } from "./controller";

const router = new Router({
  prefix: "/file",
});

router.post("/", verify, ctr.create);

export default router.routes();
