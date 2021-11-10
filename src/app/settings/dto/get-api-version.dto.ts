export class GetApiVersionResponseDto {
  /**
   * major, If this number is not the same as the mobile application major number, the application needs to be updated
   * */
  major: number;
  /**
   * minor
   * */
  minor: number;
  /**
   * patch
   * */
  patch: number;
}
