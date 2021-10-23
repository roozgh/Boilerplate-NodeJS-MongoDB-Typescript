import Router from "koa-router";
import { loginSchema, passResetSchema, passForgotSchema, passResetTokenSchema } from "./schema";
import { validate } from "../../middlewares/validate";
import { AuthController as ctr } from "./controller";

const router = new Router({
  prefix: "/auth",
});

router.post("/login", validate(loginSchema), ctr.login);
router.post("/password-reset", validate(passResetSchema), ctr.passReset);
router.post("/password-forgot", validate(passForgotSchema), ctr.passForgot);
router.post("/password-reset-token", validate(passResetTokenSchema), ctr.passResetToken);

export default router.routes();
