import { registerAs } from '@nestjs/config';
export default registerAs('Auth', () => {
  return {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    JWT_SECRET: process.env.JWT_SECRET,
  };
});
