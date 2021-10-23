import { object as o, string as s, array, boolean, date } from "yup";

const type = s().oneOf(["user", "admin"]).required();

export const userSchema = o({
  _id: s().required().length(24),
  type,
  firstName: s().required(),
  lastName: s().required(),
  email: s().email().required(),
  auth: o({
    password: s().required(),
    salt: s().required(),
    passResetToken: s().nullable(),
    passResetExpireDate: date().nullable(),
  }).required(),
  createdAt: date().required(),
});

export const updateUserSchema = o({
  firstName: s().min(2).max(25).notRequired(),
  lastName: s().min(2).max(25).notRequired(),
  email: s().email().max(50).notRequired(),
});

export const findUserSchema = o({
  _id: s().required(),
  firstName: s().required(),
  lastName: s().required(),
  email: s().required(),
  type,
});

export const getUserSchema = array().of(
  o({
    _id: s().required(),
    firstName: s().required(),
    lastName: s().required(),
    email: s().required(),
    type: s().oneOf(["user", "admin"]).required(),
  }).noUnknown()
);

export const deactivateSchema = o({
  email: s().email().max(50).required(),
  domain: s().max(100).required(),
});
