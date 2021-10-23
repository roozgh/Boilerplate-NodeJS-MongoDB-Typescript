/**
 * A Typescript Partial that works with nested Objects
 */
type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
