import { registerAs } from '@nestjs/config';
export default registerAs('Settings', () => {
  return {
    API_VERSION: process.env.API_VERSION,
    SECRET_KEY: process.env.SECRET_KEY,
  };
});
