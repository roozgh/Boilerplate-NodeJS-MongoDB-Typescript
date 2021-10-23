import { supertestHelper, validate, getSignedToken } from "../test-utils";
import { findUserSchema, getUserSchema } from "./schema";
import routes from "./route";
import { fakeUserId } from "../../utils/utils";
import { userModel } from "./model";

const adminId = fakeUserId(1);
const userId = fakeUserId(2);
const adminToken = getSignedToken(adminId);
const userToken = getSignedToken(userId);

const { req, before, after } = supertestHelper(routes);

beforeAll(before);
afterAll(after);

describe("USERS API:", () => {
  /**
   *
   */
  describe("FIND:", () => {
    test("401: Unauthorized", async () => {
      await req.get(`/users/${userId}`).expect(401);
    });

    test("400: Unauthorized", async () => {
      await req
        .get(`/users/${adminId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400, { error: "Not allowed to get other users" });
    });

    test("200: User Get", async () => {
      await req.get(`/users/${userId}`).set("Authorization", `Bearer ${userToken}`).expect(200);
    });

    test("404: Resource Doesn't Exists", async () => {
      await req
        .get("/users/notFoundResource")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404, { error: "User not found" });
    });

    test("200: ok", async () => {
      let { body } = await req
        .get(`/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      validate(findUserSchema, body);
    });
  });

  /**
   *
   */
  describe("GET:", () => {
    test("401: Unauthorized", async () => {
      await req.get("/users").expect(401);
    });

    test("400: Unauthorized", async () => {
      await req
        .get("/users")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403, { error: "Admin only Route" });
    });

    test("200: ok", async () => {
      let { body } = await req
        .get("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      getUserSchema.validateSync(body, { strict: true });
    });
  });

  /**
   *
   */
  describe("UPDATE:", () => {
    test("401: Unauthorized", async () => {
      await req.put(`/users/${userId}`).expect(401);
    });

    test("422: Validation Error", async () => {
      await req
        .put(`/users/${userId}`)
        .send({ email: "invalidEmailFormat" })
        .set("Authorization", `Bearer ${userToken}`)
        .expect(422, { error: { email: ["email must be a valid email"] } });
    });

    test("400: Unauthorized", async () => {
      await req
        .put(`/users/${adminId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({})
        .expect(400, { error: "Not allowed to edit other users" });
    });

    test("200: ok", async () => {
      await req
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          firstName: "Jon Edit",
        })
        .expect(200);

      let user = await userModel.findOne(userId);
      if (!user) throw Error("User not found");
      expect(user.firstName).toBe("Jon Edit");
      expect(user.lastName).toBe("User");
    });

    test("200: Admin ok", async () => {
      await req
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          firstName: "Jon Edit 2",
        })
        .expect(200);

      let user = await userModel.findOne(userId);
      if (!user) throw Error("User not found");
      expect(user.firstName).toBe("Jon Edit 2");
      expect(user.lastName).toBe("User");
    });
  });
});
