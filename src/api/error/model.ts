import { BaseModel } from "../base-model";

export interface ErrorType {
  _id: string;
  caughtBy: string;
  name: string;
  message: string;
  context: string;
  stack: string;
  createdAt: Date;
}

class ErrorModel extends BaseModel<ErrorType> {
  //
}

export const errorModel = new ErrorModel("errors");
