import { IMiddleware } from "koa-router";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../server/koa";
import * as mongo from "../db/mongo";
import { seed } from "../db/seed";
import { AnyObjectSchema } from "yup";

/**
 * Provides common used functionality for running
 * 'supertest' Unit Tests
 */
export function supertestHelper(routes: IMiddleware) {
  const appWithRoutes = app.use(routes).listen(process.env.SUPERTEST_PORT);
  const req = supertest(appWithRoutes);

  const before = async () => {
    let db = await mongo.connect();
    if (db) await seed(db);
  };

  const after = async () => {
    await mongo.close();
    appWithRoutes.close();
  };

  return {
    req,
    before,
    after,
  };
}

/**
 * A generic helper function for runing strict no unkown
 * 'Yup' validation.
 *
 * Will throw an Exception if validations fails
 */
export function validate(schema: AnyObjectSchema, data: any) {
  return schema.noUnknown().validateSync(data, {
    strict: true,
  });
}

/**
 *
 */
export function getSignedToken(id: string, expiresIn = 60) {
  let SECRET = process.env.SECRET as string;
  return jwt.sign({ id }, SECRET, { expiresIn });
}
