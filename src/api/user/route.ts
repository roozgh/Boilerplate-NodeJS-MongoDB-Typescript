import Router from "koa-router";
import { updateUserSchema } from "./schema";
import { validate } from "../../middlewares/validate";
import { verify } from "../../middlewares/jwt";
import { adminOnly } from "../../middlewares/admin-only";
import { UserController as ctr } from "./controller";

const router = new Router({
  prefix: "/users",
});

router.use(verify);

router.get("/:id", ctr.find);
router.get("/", adminOnly, ctr.get);
router.put("/:id", validate(updateUserSchema), ctr.update);

export default router.routes();
