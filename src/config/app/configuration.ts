import { registerAs } from '@nestjs/config';
export default registerAs('App', () => {
  return {
    MODE: process.env.MODE,
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    DEBUG: process.env.DEBUG,
  };
});
