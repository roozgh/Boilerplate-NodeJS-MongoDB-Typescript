import { Context } from "koa";
import jwt from "jsonwebtoken";
import { userModel } from "../api/user/model";

/**
 * Verifies the  Authorization Bearer token.
 * Also verifies the '_id' property in the jwt payload is a valid user.
 * It attaches a User object to the ctx state.
 */
export async function verify(ctx: Context, next: () => Promise<void>) {
  const { SECRET } = process.env;
  if (!SECRET) throw new Error("App 'secret' not found");

  try {
    const token = resolveAuthorizationHeader(ctx);
    const { id }: any = jwt.verify(token, SECRET);
    ctx.state.user = await getUser(id, ctx.throw);
    return next();
  } catch (e: any) {
    if (["TokenExpiredError", "JsonWebTokenError", "UnauthorizedError"].includes(e.name)) {
      return ctx.throw(401, e.message);
    }
    throw e;
  }
}

/**
 * Retrieve authorization Token form the request header
 */
export function resolveAuthorizationHeader(ctx: Context): string {
  if (!ctx.header || !ctx.header.authorization) {
    return ctx.throw(401, "Request Header must contain an 'Authorization' property");
  }

  let parts = ctx.header.authorization.split(" ");

  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return token;
    }
  }
  return ctx.throw(
    401,
    'Bad Authorization header format. Format is "Authorization: Bearer <token>"'
  );
}

/**
 *
 */
async function getUser(id: string, abort: Context["throw"]) {
  if (!id) {
    return abort(401, "JWT Payload must contain a valid 'id property");
  }
  const user = await userModel.findOne(id, ["type"]);
  if (!user) {
    return abort(401, "JWT Invalid id. User not found");
  }
  return user;
}
