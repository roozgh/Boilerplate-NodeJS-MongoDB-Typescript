/**
 *
 */
export function makeId(length = 24) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Makes a 24 character string.
 * Useful for databse 'seeds'
 */
export function fakeUserId(n: number) {
  return "_".repeat(23) + n;
}

/**
 * Takes an Object literal & returns a new Object
 * with all it's properties with 'undefined' value removed
 */
export function stripUndefined(obj: any, nullType: undefined | null = undefined): any {
  function isObj(obj: any) {
    return typeof obj === "object" && obj !== null;
  }

  function reducer(newObj: any, k: string) {
    if (isObj(obj[k])) {
      return { ...newObj, [k]: stripUndefined(obj[k]) };
    } else {
      return { ...newObj, [k]: obj[k] };
    }
  }

  return Object.keys(obj)
    .filter((k) => obj[k] !== nullType)
    .reduce(reducer, {});
}
