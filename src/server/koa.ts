import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { errorHandlingMiddleware, onUnhandledRejection, onAppEmitError } from "./error-handle";
// No Typescript support
const koaStatic = require("koa-static");

const app = new Koa();

// -------  Error handling  ---------- //
app.use(errorHandlingMiddleware);
app.on("error", onAppEmitError);
process.on("unhandledRejection", onUnhandledRejection);

// -----------  Static Files   ----------- //
app.use(koaStatic("./public"));
app.use(bodyParser());

app.proxy = true;

export { app };
