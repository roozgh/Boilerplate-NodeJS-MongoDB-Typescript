import { Context } from "koa";
import { userModel } from "./model";
import { stripUndefined } from "../../utils/utils";

const fields = ["firstName", "lastName", "email", "type", "createAt"];

export class UserController {
  /**
   *
   */
  static async find(ctx: Context) {
    const { id } = ctx.params;
    if (ctx.state.user.type === "user" && ctx.state.user._id !== id) {
      ctx.throw(400, "Not allowed to get other users");
    }
    const user = await userModel.findOne(id, fields);
    if (!user) ctx.throw(404, "User not found");
    ctx.body = user;
  }

  /**
   *
   */
  static async get(ctx: Context) {
    const users = await userModel.find({}, fields);
    ctx.body = users;
  }

  /**
   *
   */
  static async update(ctx: Context) {
    const { firstName, lastName, email } = ctx.request.body;
    const { id } = ctx.params;
    // 'actingUser' is the user that sent the request to 'update
    const actingUser = ctx.state.user;

    const user = await userModel.findOne(id, ["email"]);
    if (!user) ctx.throw(400, "User not found");

    // If user is not Admin an trying to edit someone else's details
    if (actingUser.type == "user" && user._id !== actingUser._id) {
      ctx.throw(400, "Not allowed to edit other users");
    }

    if (email && email !== user.email) {
      let user = await userModel.findByEmail(email);
      if (user) ctx.throw(400, "Email already taken");
    }
    //stripUndefined()
    await userModel.update(id, stripUndefined({ firstName, lastName, email }));

    ctx.body = "ok";
  }
}
