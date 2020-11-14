const config = {
  appDefaults: {
    PORT: process.env.PORT,
    ENVIRONMENT: process.env.NODE_ENV,
    DATABASE: {
      HOST: process.env.APP_DATABASE_HOST,
      NAME: process.env.APP_DATABASE_NAME,
      USERNAME: process.env.DB_USERNAME,
      PASSWORD: process.env.DB_PASSWORD,
    },
  },
};

module.exports = config;
