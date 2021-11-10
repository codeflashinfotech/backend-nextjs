import { registerAs } from '@nestjs/config';
export default registerAs('Kroger', () => {
  return {
    CLIENT_ID: process.env.KROGER_CLIENT_ID,
    CLIENT_SECRET: process.env.KROGER_CLIENT_SECRET,
  };
});
