import * as dotenv from 'dotenv';
dotenv.config();

interface IConfig {
  dbUrl: string;
  port: number;
  NODE_ENV: string;
  TOKEN: {
    ACCESS_TOKEN_KEY: string;
    ACCESS_TOKEN_TIME: number;
    REFRESH_TOKEN_KEY: string;
    REFRESH_TOKEN_TIME: number;
  };
  SUPER_ADMIN: {
    USERNAME: string;
    PASSWORD: string;
    FULLNAME: string;
  };
  UPLOAD_FOLDER: string;
}

export const appConfig: IConfig = {
  dbUrl: String(process.env.DB_URL),
  port: Number(process.env.PORT),
  NODE_ENV: String(process.env.NODE_ENV),
  TOKEN: {
    ACCESS_TOKEN_KEY: String(process.env.TOKEN_ACCESS_TOKEN_KEY),
    ACCESS_TOKEN_TIME: Number(process.env.TOKEN_ACCESS_TOKEN_TIME),
    REFRESH_TOKEN_KEY: String(process.env.TOKEN_REFRESH_TOKEN_KEY),
    REFRESH_TOKEN_TIME: Number(process.env.TOKEN_REFRESH_TOKEN_TIME),
  },
  SUPER_ADMIN: {
    USERNAME: String(process.env.SUPER_ADMIN_USERNAME),
    PASSWORD: String(process.env.SUPER_ADMIN_PASSWORD),
    FULLNAME: String(process.env.SUPER_ADMIN_FULLNAME),
  },
  UPLOAD_FOLDER: String(process.env.UPLOAD_FOLDER),
};
