module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "adminadmin",
  DB: process.env.DB_NAME || "quality_control_app",
  dialect: "postgres",
  port: parseInt(process.env.DB_PORT) || 5432,
};
