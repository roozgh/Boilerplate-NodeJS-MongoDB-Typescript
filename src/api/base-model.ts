import { Filter, Collection, InsertManyResult, InsertOneResult } from "mongodb";
import { SetOptional } from "type-fest";
import { coll } from "../db/mongo";
import { makeId } from "../utils/utils";

interface GenericType {
  _id: string;
  createdAt: Date;
}

export class BaseModel<T extends GenericType> {
  name: string;
  // Disable Mongo's native Typescript by using 'any'.
  // It causes more issues than solve problems
  coll: Collection<any>;

  constructor(name: string) {
    this.name = name;
    this.coll = coll(name);
  }

  /**
   *
   */
  findOne(_id: string, fields?: string[]): Promise<T | null> {
    let projection = {};
    if (fields) projection = fieldsToProjection(fields);
    return this.coll.findOne({ _id }, projection);
  }

  /**
   *
   */
  async find(filter: Filter<T>, fields?: string[]): Promise<T[]> {
    let projection = {};
    if (fields) projection = fieldsToProjection(fields);
    const result = this.coll.find(filter, projection);
    return result.toArray();
  }

  /**
   *
   */
  update(_id: string, updateFilter: RecursivePartial<T>) {
    return this.coll.updateOne({ _id }, { $set: updateFilter });
  }

  /**
   * '_id' and 'createdAt' fields are optional
   */
  insert(item: SetOptional<T, "_id" | "createdAt">): Promise<InsertOneResult<T>> {
    // Add '_id' and 'createdAt' fields if missing
    const _id = item._id ? item._id : makeId();
    const createdAt = item.createdAt ? item.createdAt : new Date();
    item = { ...item, _id, createdAt };
    return this.coll.insertOne(item);
  }

  /**
   * '_id' and 'createdAt' fields are optional
   */
  insertMany(items: SetOptional<T, "_id" | "createdAt">[]): Promise<InsertManyResult<T>> {
    // Add '_id' and 'createdAt' fields if missing
    items = items.map((item) => {
      const _id = item._id ? item._id : makeId();
      const createdAt = item.createdAt ? item.createdAt : new Date();
      return { ...item, _id, createdAt };
    });
    return this.coll.insertMany(items);
  }

  /**
   *
   */
  delete(_id: string) {
    return this.coll.deleteMany({ _id });
  }

  /**
   *
   */
  deleteMany(filter: Filter<T>) {
    return this.coll.deleteMany(filter);
  }
}

/**
 * Takes an array of string containing document fields.
 * Returns a { projection: {fieldExample: 1} } object literal
 */
function fieldsToProjection(fields: string[]) {
  let projection: { [k: string]: 1 } = {};
  for (let field of fields) {
    projection[field] = 1;
  }
  return { projection: projection };
}
