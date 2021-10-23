import { Context } from "koa";

/**
 *
 */
export function adminOnly(ctx: Context, next: () => Promise<void>) {
  let { user } = ctx.state;
  if (!user) {
    throw new Error("Koa Contect State did not have 'user' Object");
  }
  if (user.type !== "admin") {
    return ctx.throw(403, "Admin only Route");
  }
  return next();
}
