import { object, string as s } from "yup";

const email = s().email().required();
const password = s().min(4).max(24).required();

export const loginSchema = object({
  email,
  password,
});

export const passForgotSchema = object({
  email,
});

export const passResetTokenSchema = object({
  token: s().required(),
  newPassword: password,
  newPasswordConfirmation: password,
});

export const passResetSchema = object({
  email,
  password,
  newPassword: password,
  newPasswordConfirmation: password,
});

export const loginResponseSchema = object({
  accessToken: s().required(),
  user: object({
    _id: s().required(),
    type: s().required(),
    firstName: s().required(),
    lastName: s().required(),
    email: s().email().required(),
    createdAt: s().required(),
  }),
});
