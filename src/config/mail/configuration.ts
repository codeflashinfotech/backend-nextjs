import { registerAs } from '@nestjs/config';
export default registerAs('Mail', () => {
  return {
    MAIL_TRANSPORT: process.env.MAIL_TRANSPORT,
    MAIL_FROM: process.env.MAIL_FROM,
    MAIL_SUPPORT: process.env.MAIL_SUPPORT,
  };
});
