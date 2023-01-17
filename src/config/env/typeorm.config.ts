export interface TypeOrmConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const typeOrmConfig = (): { database: TypeOrmConfig } => {
  const {
    DATABASE_HOST: host,
    DATABASE_PORT: port,
    DATABASE_PASSWORD: password,
    DATABASE_USER: username,
    DATABASE_NAME: database,
  } = process.env;

  return {
    database: {
      host,
      port: parseInt(port || '5432', 10),
      password,
      username,
      database,
    },
  };
};
