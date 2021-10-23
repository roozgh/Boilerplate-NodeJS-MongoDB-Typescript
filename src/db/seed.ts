import { Db } from "mongodb";
import { fakeUserId } from "../utils/utils";
import { userModel } from "../api/user/model";

const createdAt = new Date("2021-01-01 00:00:00");

export async function seed(_db: Db) {
  // ============   USERS    ============ //
  // user passwords are 'crown1234'
  await userModel.deleteMany({});
  await userModel.insertMany([
    {
      _id: fakeUserId(1),
      type: "admin",
      firstName: "Jon",
      lastName: "Admin",
      email: "admin@test.com",
      auth: {
        password:
          "6be0fcef95e13997d4678f2a0d3ca827d7b7bbe04452a2b7674329f798d7bdd854f45fcf58802c59e2b55f52be96dff108f464cbc66571f21d2402db774fbc7b",
        salt: "fd969ae912611766",
        passResetToken: null,
        passResetExpireDate: null,
      },
      createdAt,
    },
    {
      _id: fakeUserId(2),
      type: "user",
      firstName: "Jon",
      lastName: "User",
      email: "user@test.com",
      auth: {
        password:
          "6be0fcef95e13997d4678f2a0d3ca827d7b7bbe04452a2b7674329f798d7bdd854f45fcf58802c59e2b55f52be96dff108f464cbc66571f21d2402db774fbc7b",
        salt: "fd969ae912611766",
        passResetToken: null,
        passResetExpireDate: null,
      },
      createdAt,
    },
    {
      _id: fakeUserId(3),
      type: "user",
      firstName: "Jon",
      lastName: "User 2",
      email: "user2@test.com",
      auth: {
        password:
          "6be0fcef95e13997d4678f2a0d3ca827d7b7bbe04452a2b7674329f798d7bdd854f45fcf58802c59e2b55f52be96dff108f464cbc66571f21d2402db774fbc7b",
        salt: "fd969ae912611766",
        passResetToken: null,
        passResetExpireDate: null,
      },
      createdAt,
    },
  ]);
}
