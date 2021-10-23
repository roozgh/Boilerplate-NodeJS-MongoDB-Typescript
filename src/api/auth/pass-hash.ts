import crypto from "crypto";

export class PassHash {
  /**
   *
   */
  static genRandomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length);
  }

  /**
   *
   */
  static sha512(password: string, salt: string): string {
    let hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    return hash.digest("hex");
  }

  /**
   *
   */
  static saltHashPassword(password: string) {
    // Gives us salt of length 16
    let salt = PassHash.genRandomString(16);
    let passwordHash = PassHash.sha512(password, salt);
    return { passwordHash, salt };
  }
}
