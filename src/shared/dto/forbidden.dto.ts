export class ForbiddenDto {
  /**
   * Status code in body
   * @example 403
   */
  statusCode: number;

  /**
   * Error message
   * @example 'Forbidden resource (e.g. user does not have required role in given family)'
   */
  message: string;

  /**
   * Error name
   * @example 'Forbidden'
   */
  error: string;
}
