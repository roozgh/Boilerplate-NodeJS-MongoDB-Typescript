/**
 * Could be used to save image on Disk
 * or save image on Azure, Amazon image containers
 */
export function uploadFile(tmpPath: string, originalName: string, extention: string, size: number) {
  // Do somthing with it
  console.log("FILE UPLOADED", tmpPath, originalName, extention, size);
}
