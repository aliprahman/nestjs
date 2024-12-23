import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.ENV || 'development',
  secret: process.env.SECRET_KEY || 'B4C5F13F6CA2B1971C9E7F2B9B319',
  salt: process.env.SALT_PASSWORD || 10,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  webUrl: process.env.WEB_URL || 'http://localhost:8080'
}));
