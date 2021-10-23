import dotenv from "dotenv";
dotenv.config();

import { connect, close } from "./mongo";
import { seed } from "./seed";

/**
 * 'npm run seed' from the command line.
 * Will populate the DB with dummy data
 */
(async () => {
  let db = await connect();
  await seed(db);
  await close();
})();
