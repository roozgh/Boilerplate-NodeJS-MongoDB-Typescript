import { supertestHelper, validate } from "../test-utils";
import { loginResponseSchema } from "./schema";
import routes from "./route";

const { req, before, after } = supertestHelper(routes);

beforeAll(before);
afterAll(after);

describe("AUTH API:", () => {
  /**
   *
   */
  describe("LOGIN:", () => {
    test("422: Validation Error", async () => {
      await req
        .post("/auth/login")
        .send({})
        .expect(422, {
          error: {
            email: ["email is a required field"],
            password: ["password is a required field"],
          },
        });
    });

    test("400: Incorrect Password", async () => {
      await req
        .post("/auth/login")
        .send({
          email: "admin@test.com",
          password: "inValidPassword1234",
        })
        .expect(400, { error: "Invalid Email or Password" });
    });

    test("400: Incorrect Email", async () => {
      await req
        .post("/auth/login")
        .send({
          email: "invalid@test.com",
          password: "crown1234",
        })
        .expect(400, { error: "Invalid Email or Password" });
    });

    test("200: ok", async () => {
      let { body } = await req
        .post("/auth/login")
        .send({
          email: "admin@test.com",
          password: "crown1234",
        })
        .expect(200);

      validate(loginResponseSchema, body);
    });
  });
});
