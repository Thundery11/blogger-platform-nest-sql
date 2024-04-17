import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const { PGURL } = process.env;
export default new DataSource({
  url: PGURL,
  type: 'postgres',
  migrations: ['./migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
});
