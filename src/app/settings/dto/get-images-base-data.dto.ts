export class GetImagesBaseDataResponseDto {
  /**
   * url of image server. for use to concat image name with this url
   * */
  s3BaseUrl: string;

  /**
   * avatar bucket. use ror fetch avatars only
   * */
  s3AavatarBucket: string;

  /**
   * initial products bucket. 32 image contain in this bucket they used for system default products
   * */
  s3InitialProductImageBucket: string;

  /**
   * uploaded images for product saves in this bucket
   * */
  s3ProductImageBucket: string;
}
