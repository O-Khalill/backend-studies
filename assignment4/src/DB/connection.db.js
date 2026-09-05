import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3,
    dialect: "mysql",
    logging: console.log,
  },
);

const test = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully");
  } catch (err) {
    console.log("DB didn't connect" + err);
  }
};

export default test;
