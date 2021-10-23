import dotenv from "dotenv";
dotenv.config();

import { app } from "./koa";
import { connect } from "../db/mongo";
import routes from "./routes";

(async () => {
  // Can pass 'db' to 'Agenda' library for runing Cron Jobs
  const db = await connect();
  app.use(routes);
  app.listen(process.env.PORT);
})();
