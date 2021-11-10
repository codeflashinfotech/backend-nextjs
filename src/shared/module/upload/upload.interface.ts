export interface FileInterface {
  fieldname: string;
  /**
   * this is file name
   * */
  originalname: string;
  encoding: string;
  mimetype: string;
  /**
   * main content of file
   * */
  buffer: Buffer;
  size: number;
}
