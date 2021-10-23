import { MongoClient, Db, MongoClientOptions } from "mongodb";

const { MONGO_URL, MONGO_DATABASE } = process.env;
if (!MONGO_URL || !MONGO_DATABASE) throw new Error("MongoDB credentials not found");

const { log } = console;

const connOpts: MongoClientOptions = {
  connectTimeoutMS: 2000,
};

const client = new MongoClient(MONGO_URL, connOpts);

/**
 *
 */
export function db(): Db {
  return client.db(process.env.MONGO_DATABASE);
}

/**
 * Takes a collection name and eturns
 * a MongoDB 'Collection' Object
 */
export function coll<T>(tableName: string) {
  return db().collection<T>(tableName);
}

/**
 *
 */
export async function connect() {
  try {
    await client.connect();
    client.on("close", () => log("Mongo connection lost"));
    client.on("timeout", () => log("Mongo Timeout"));
    client.on("error", (e) => log(e.message));
    client.on("reconnect", () => log("Mongo Reconnect"));

    return db();
  } catch (e) {
    log("Could not connect to MongoDB");
    throw e;
  }
}

/**
 *
 */
export function close() {
  return client.close();
}
