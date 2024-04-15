import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const { PGDATABASE } = process.env;
export default new DataSource({
  url: PGDATABASE,
  type: 'postgres',
  migrations: ['./migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});
