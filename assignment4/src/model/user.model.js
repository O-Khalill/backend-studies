import { DataTypes } from "sequelize";
import { sequelize } from "../DB/connection.db.js";
import { hooks } from "sequelize/lib/hooks";
const checkNameLength = (name) => {
  if (typeof name !== "string" || name.trim().length <= 2) {
    const error = new Error(
      "Password length must be greather than or equal to two and type must be string",
    );
    error.statusCode = 400;
    return error;
  }
};
const users = sequelize.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (!value || value.length < 7) {
            throw new Error("Password lenght must be greater 6 characters");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },

  {
    timestamps: true,
    paranoid: true,
    tableName: "users",
    sequelize,
    hooks: {
      beforeCreate: (name) => {
        checkNameLength(name);
      },
    },
  },
);

export default users;
