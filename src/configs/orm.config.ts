require('dotenv/config');
import { DataSource, LoggerOptions } from "typeorm"
import "reflect-metadata"


export const dataSource = new DataSource( {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'backend',
  port: process.env.DB_PORT as unknown as number || 3306,
  // charset: 'utf8',
//   driver: 'mysql',
  synchronize: false,
  charset: "utf8mb4_unicode_ci",
  entities: process.env.NODE_ENV !== 'production' ? ['**/**.entity.ts'] : ['dist/**/*.entity.js'],
  logging: process.env.NODE_ENV !== 'production' ? 'all' : 'error' as LoggerOptions,
  migrations: process.env.NODE_ENV !== 'production'? ['src/migrations/*.ts'] : ['dist/migrations/*.js'],
//   cli: {
//     migrationsDir: 'src/migrations'
//   },
  connectTimeout: 30000,
  acquireTimeout: 30000
});

// export default dataSource;

