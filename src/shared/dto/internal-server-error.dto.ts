export class InternalServerErrorDto {
  /**
   * Status code in body
   * @example 500
   */
  statusCode: number;

  /**
   * List of error messages
   * @example ['cant save in database please try again']
   */
  message: string;

  /**
   * Error message
   * @example 'Internal Server Error'
   */
  error: string;
}
