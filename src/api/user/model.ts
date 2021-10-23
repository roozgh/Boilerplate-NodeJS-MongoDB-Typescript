import { BaseModel } from "../base-model";

interface UserType {
  _id: string;
  type: "user" | "admin";
  firstName: string;
  lastName: string;
  email: string;
  auth: {
    password: string;
    salt: string;
    passResetToken: string | null;
    passResetExpireDate: Date | null;
  };
  createdAt: Date;
}

class UserModel extends BaseModel<UserType> {
  /**
   *
   */
  findByEmail(email: string): Promise<UserType | null> {
    // Case sensetive Match
    const emailRegEx = new RegExp("^" + email, "i");
    return this.coll.findOne({ email: emailRegEx });
  }

  /**
   *
   */
  findByToken(token: string): Promise<UserType> {
    return this.coll.findOne({ "auth.passResetToken": token }, { projection: { auth: 1 } });
  }
}

export const userModel = new UserModel("users");
