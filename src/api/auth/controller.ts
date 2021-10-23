import { Context } from "koa";
import jwt from "jsonwebtoken";
import moment from "moment";
import { userModel } from "../user/model";
import { makeId } from "../../utils/utils";
import { PassHash } from "./pass-hash";
import config from "../../config";
import { logError } from "../error/logger";

const PASS_EXP_HOURS = config.app.passResetExpDuration;
const JWT_EXP_HOURS = config.app.jwtExpIn;

export class AuthController {
  /**
   *
   */
  static async login(ctx: Context) {
    const { email, password } = ctx.request.body;
    const { _id } = await validateUserCredential(email, password, ctx.throw);
    const accessToken = getAccessToken(_id);
    const user = await getUser(_id);
    ctx.body = { user, accessToken };
  }

  /**
   *  Emails user an Email with a link to password reset page
   */
  static async passForgot(ctx: Context) {
    const { email } = ctx.request.body;

    const user = await userModel.findByEmail(email);
    if (!user) ctx.throw(400, "Email not found");

    const { _id, auth } = user;
    let { passResetToken, passResetExpireDate } = auth;
    if (passResetToken && passResetExpireDate && !tokenExpired(passResetExpireDate)) {
      ctx.throw(400, "Email already sent");
    }

    const token = makeId(16);
    const frontEndWebsite = "www.example.com";
    const resetLink = `${frontEndWebsite}/reset/${token}`;

    /**
     * Send the 'resetLink' containing the 'token' to
     * the user via Email. Using the token they can reset
     * their password using POST /password-reset-token
     */

    passResetExpireDate = moment().add(PASS_EXP_HOURS, "hours").toDate();
    await userModel.update(_id, { auth: { passResetToken: token, passResetExpireDate } });

    ctx.body = "ok";
  }

  /**
   *  Recieves token and new password from user.
   *  Creates a new password and generates a new JWT
   */
  static async passResetToken(ctx: Context) {
    const { token, newPassword, newPasswordConfirmation } = ctx.request.body;

    if (newPassword != newPasswordConfirmation) {
      ctx.throw(400, "Password Confirmation do not match");
    }

    const user = await userModel.findByToken(token);
    if (!user) ctx.throw(400, "Invalid Token");

    const { _id, auth } = user;
    const { passResetToken, passResetExpireDate } = auth;
    if (!passResetToken || !passResetExpireDate || tokenExpired(passResetExpireDate)) {
      ctx.throw(400, "Token Expired");
    }

    const { passwordHash, salt } = PassHash.saltHashPassword(newPassword);
    await userModel.update(_id, {
      auth: {
        salt,
        password: passwordHash,
        passResetToken: null,
        passResetExpireDate: null,
      },
    });

    const accessToken = getAccessToken(_id);
    const _user = await getUser(_id);

    ctx.body = { accessToken, user: _user };
  }

  /**
   *  Resets the users password
   */
  static async passReset(ctx: Context) {
    const { email, password, newPassword, newPasswordConfirmation } = ctx.request.body;
    if (newPassword != newPasswordConfirmation) {
      ctx.status = 422;
      return (ctx.body = {
        error: { newPassword: "Password confirmation do not match" },
      });
    }

    const { _id } = await validateUserCredential(email, password, ctx.throw);
    const { passwordHash, salt } = PassHash.saltHashPassword(newPassword);

    await userModel.update(_id, {
      auth: {
        salt,
        password: passwordHash,
        passResetToken: null,
        passResetExpireDate: null,
      },
    });

    const accessToken = getAccessToken(_id);
    const user = await getUser(_id);
    return (ctx.body = { user, accessToken });
  }
}

/**
 * Authorise user by sending them them their Json Web Token
 */
function getAccessToken(userId: string): string {
  const expiresIn = 60 * 60 * JWT_EXP_HOURS;
  const options = { expiresIn };
  const payload = { id: userId };
  const { SECRET } = process.env;
  if (!SECRET) throw new Error("App 'secret' not found");
  return jwt.sign(payload, SECRET, options);
}

/**
 * Checks given Email & Password againist the Users collectionbundleRenderer.renderToStream
 * throws a koa Error if user not found;
 */
async function validateUserCredential(email: string, password: string, abort: Context["throw"]) {
  const user = await userModel.findByEmail(email);
  if (!user) abort(400, "Invalid Email or Password");
  let hashedPass = "";
  try {
    hashedPass = PassHash.sha512(password, user.auth.salt);
  } catch (e) {
    logError(e, "validateUserCredential");
    abort(400, "Invalid Email or Password");
  }

  if (user.auth.password !== hashedPass) abort(400, "Invalid Email or Password");
  return user;
}

/**
 *
 */
async function getUser(_id: string) {
  const fields = ["type", "firstName", "lastName", "email", "createdAt"];
  return userModel.findOne(_id, fields);
}

/**
 *  Checks if a given time is in the past
 */
function tokenExpired(expireDate: Date): boolean {
  return moment() > moment(expireDate);
}
