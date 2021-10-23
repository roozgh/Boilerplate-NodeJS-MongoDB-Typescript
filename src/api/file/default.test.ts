import path from "path";
import { supertestHelper, getSignedToken } from "../test-utils";
import routes from "./route";
import { fakeUserId } from "../../utils/utils";

jest.mock("../../services/file-upload/file-upload");

const _id = fakeUserId(2);
const token = getSignedToken(_id);

const { req, before, after } = supertestHelper(routes);
const filePath = path.resolve(__dirname, "./test-image.jpg");

beforeAll(before);
afterAll(after);

describe("FILE API: ", () => {
  describe("CREATE: ", () => {
    test("401: Unauthorized", async () => {
      await req.post("/file").expect(401);
    });

    test("200 ok", async () => {
      let res = await req
        .post("/file")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", filePath)
        .expect(200);

      expect(res.text).toBe("ok");
    });
  });
});
