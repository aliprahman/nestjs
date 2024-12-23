import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT, 10) || 2525,
  user: process.env.EMAIL_USER || '424275feee06fe',
  password: process.env.EMAIL_PASSWORD || 'bcf5eda95f0705',
  secure: process.env.EMAIL_SECURE === 'true' ? true : false,
  form: process.env.EMAIL_FROM || '"No Reply" <noreply@example.com>',
}));
