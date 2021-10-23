import { errorModel } from "./model";

const { log, info } = console;

/**
 * A helper function for formatting JS errors
 * and then storing them in database.
 */
export async function logError(error: unknown, caughtBy = "") {
  const { name, message, stack } = error as Error;
  const context = getErrorContext(stack);
  info(`"Error": ${message} | "Found At": ${context}`);
  try {
    await errorModel.insert({
      caughtBy,
      name,
      message,
      context,
      stack: JSON.stringify(stack),
    });
  } catch (e) {
    log('"Error": Could not write Error to DB', e);
    // Can send Email or SMS notifying DB is down.
  }
}

/**
 *
 */
function getErrorContext(stack?: String) {
  if (!stack) return "";
  const splitStack = stack.split("\n");
  if (!Array.isArray(splitStack)) return "";
  if (splitStack[1] == undefined) return "";
  return splitStack[1].trim();
}
