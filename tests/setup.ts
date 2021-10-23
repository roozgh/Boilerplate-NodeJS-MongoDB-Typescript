import * as dotenv from "dotenv";
dotenv.config();

process.env.ENV = "test";

jest.setTimeout(10000);
