import { Sequelize, Options } from 'sequelize';

interface DatabaseConfigValue extends Options {
  use_env_variable?: string;
}

interface DatabaseConfig {
  [key: string]: DatabaseConfigValue
}

const config: DatabaseConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: false,
    },
  },
  test: {
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

export default config;