import { Context } from "koa";
import * as nodePath from "path";
import { uploadFile } from "../../services/file-upload/file-upload";
import { parseMultipart } from "./parse-multipart";
import { logError } from "../error/logger";

const MAX_FILES_SIZE = 1000000 * 10; //10 Megabyts

export class FileController {
  /**
   *
   */
  static async create(ctx: Context) {
    try {
      let { size, path, originalname } = await parseMultipart(ctx.req);

      if (size > MAX_FILES_SIZE) {
        ctx.throw(
          400,
          `File too large. Maximum file size is ${MAX_FILES_SIZE / 1000000} Megabytes`
        );
      }
      const extension = nodePath.extname(originalname);
      uploadFile(path, originalname, extension, size);
      ctx.body = "ok";
    } catch (e: any) {
      if (e.message == "FILE_NOT_FOUND") {
        ctx.throw(400, "Upload request must contain a file field with name 'File'");
      } else if (e.message == "FILE_PROP_NOT_FOUND") {
        ctx.throw(400, "Upload request must contain a file field with name 'File'");
      } else {
        logError(e);
        ctx.throw(400, "Could not upload file");
      }
    }
  }
}
