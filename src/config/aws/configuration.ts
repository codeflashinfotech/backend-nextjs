import { registerAs } from '@nestjs/config';
export default registerAs('AWS', () => {
  return {
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_AVATAR_BUCKET: process.env.S3_AVATAR_BUCKET,
    S3_INITIAL_PRODUCT_IMAGE_BUCKET:
      process.env.S3_INITIAL_PRODUCT_IMAGE_BUCKET,
    S3_PRODUCT_IMAGE_BUCKET: process.env.S3_PRODUCT_IMAGE_BUCKET,
    S3_BASE_URL: process.env.S3_BASE_URL,
  };
});
