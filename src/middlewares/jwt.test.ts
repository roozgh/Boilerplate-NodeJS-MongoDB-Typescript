import jwt from "jsonwebtoken";
import { createResponse, createRequest, RequestOptions } from "node-mocks-http";
import Koa from "koa";
import { verify } from "./jwt";
import * as mongo from "../db/mongo";
import { seed } from "../db/seed";
import { fakeUserId } from "../utils/utils";

const SECRET = process.env.SECRET as string;

// An expired Token
const expToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxX19fX19fX19fX19fX19fX19fX19fX18iLCJpYXQiOjE1NzM0NzY1NjYsImV4cCI6MTU3MzQ3NjYyNn0.pSJ5AvK7b9RGEFlY54VIOWNKW9DeW2z43dPD9MwEL0o";

/**
 *
 */
function makeFakeKoaCtx(reqOpts: RequestOptions) {
  const koa = new Koa();
  const res = createResponse();
  const req = createRequest(reqOpts);
  const ctx = koa.createContext(req, res);
  const next: any = () => {};
  return { ctx, next };
}

beforeAll(async () => {
  let db = await mongo.connect();
  if (db) return seed(db);
});
afterAll(mongo.close);

describe("JWT VERIFY: ", () => {
  test("Token Expired: ", async () => {
    let reqOpts = {
      headers: { Authorization: `Bearer ${expToken}` },
    };

    let { ctx, next } = makeFakeKoaCtx(reqOpts);
    try {
      await verify(ctx, next);
      throw new Error("should throw error");
    } catch (e: any) {
      expect(e.message).toBe("jwt expired");
    }
  });

  test("Invalid Token: ", async () => {
    let reqOpts = {
      headers: { Authorization: `Bearer invalid.jwt.token` },
    };

    let { ctx, next } = makeFakeKoaCtx(reqOpts);
    try {
      await verify(ctx, next);
      throw new Error("should throw error");
    } catch (e: any) {
      expect(e.message).toBe("invalid token");
    }
  });

  test("Verify Success: ", async () => {
    const id = fakeUserId(1);
    let token = jwt.sign({ id }, SECRET, { expiresIn: 60 });
    let reqOpts = {
      headers: { Authorization: `Bearer ${token}` },
    };

    let { ctx, next } = makeFakeKoaCtx(reqOpts);
    await verify(ctx, next);
    let { user } = ctx.state;

    expect(user).toBeDefined();
    expect(user._id.toString()).toBe(id);
    expect(user.type).toBe("admin");
  });
});
