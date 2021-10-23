import { Context } from "koa";
import { logError } from "../api/error/logger";

/**
 * Koa main error handling middleware.
 */
export async function errorHandlingMiddleware(ctx: Context, next: any): Promise<void> {
  try {
    await next();
  } catch (err) {
    const e = standardizeError(err);
    const status = e.status || 500;
    let message = e.message;

    if (status == 500) {
      if (process.env.ENV == "production") {
        // Hide 500 error message from end user
        message = "Something went wrong!";
      }
      // Log all 500 errors into database
      logError(e, "Error Handling Middleware");
    }

    ctx.status = status;
    ctx.body = {
      error: message,
    };
  }
}

/**
 * For unhandled rejected Promises
 */
export async function onUnhandledRejection(err: any) {
  const e = standardizeError(err);
  logError(e, "Unhandled Rejection");
}

/**
 * Catches Errors for ctx.app.emit("error", ...)
 */
export async function onAppEmitError(err: any) {
  const e = standardizeError(err);
  logError(e, "App Emit");
}

/**
 * Checks if Exception thrown is a String
 * and returns it as a new Error Object
 */
function standardizeError(e: unknown): any {
  if (typeof e == "string") return new Error(e);
  return e;
}
