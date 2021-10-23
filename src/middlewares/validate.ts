import { Context } from "koa";
import { ValidationError as YupError, AnyObjectSchema } from "yup";

/**
 * Middleware that validates JSON data in request bodt
 * against a TUP ObjectSchema. Will returna 422 error
 * of validation fails.
 */
export function validate(validationSchema: AnyObjectSchema) {
  return function (ctx: Context, next: () => Promise<void>) {
    try {
      ctx.request.body = validateAndStrip(validationSchema, ctx.request.body);
      return next();
    } catch (e: any) {
      ctx.status = 422;
      ctx.body = { error: formatError(e) };
      return ctx;
    }
  };
}

/**
 * Validates a JSON Object against a 'Yup' ObjectSchema.
 *
 * If validation fails, it will throw a new 'ValidationError' Error.
 *
 * It also strips any Unknown properites off the Input and returns
 * a Sanitized version of the Input
 */
function validateAndStrip(schema: AnyObjectSchema, input: any) {
  return schema.noUnknown().validateSync(input, {
    abortEarly: false,
    strict: true,
  });
}

/**
 *
 */
export function formatError(e: YupError) {
  return e.inner.reduce((res, err) => {
    let { path, message } = err;
    if (path == undefined) return res;
    if (res[path]) res[path].push(message);
    else res[path] = [message];
    return res;
  }, Object.create(null));
}
