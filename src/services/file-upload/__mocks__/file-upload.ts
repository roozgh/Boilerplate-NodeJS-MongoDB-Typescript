/**
 * Example of a Mock function. Mocks are useful when you
 * want to test code that uses thrid party API such as
 * Twitter or Google Maps and you want to avoid calling those
 * APIs and every test.
 */
export function uploadFile(tmpPath: string, originalName: string, extention: string, size: number) {
  console.log("FILE UPLOADED MOCK", tmpPath, originalName, extention, size);
}
