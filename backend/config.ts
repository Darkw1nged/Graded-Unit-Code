export interface Config {
  jwtSecret: string;
  database: {
    host: string;
    user: string;
    database: string;
    password: string;
    port: number;
  };
}

const config: Config = {
  jwtSecret: "NPfS.k9h<Lk2U[q^",
  database: {
    host: 'localhost',
    user: 'root',
    database: 'college',
    password: '99Bootboy!',
    port: 3306
  },
};

export default config;
