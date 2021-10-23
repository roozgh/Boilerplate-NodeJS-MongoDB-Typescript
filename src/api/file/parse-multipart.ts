import * as multiparty from "multiparty";
import { Context } from "koa";

interface MultipartParseReponse {
  path: string;
  filename: string;
  originalname: string;
  size: number;
  contentType: string;
}

/**
 *
 */
export function parseMultipart(req: Context["req"]): Promise<MultipartParseReponse> {
  return new Promise((resolve, reject) => {
    let form = new multiparty.Form();

    form.parse(req, (err, _1, files) => {
      if (err) return reject(err);
      if (!files.file) {
        let e = new Error("FILE_PROP_NOT_FOUND");
        return reject(e);
      }

      let file = files.file[0];
      let e = new Error("FILE_NOT_FOUND");
      if (!file) return reject(e);

      let res = {
        path: file.path,
        filename: (Math.random() * 10000).toFixed(),
        originalname: file.originalFilename,
        size: file.size,
        contentType: file.headers["content-type"],
      };

      return resolve(res);
    });
  });
}
