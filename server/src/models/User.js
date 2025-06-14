// src/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt"); // Add this at the top

const User = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.UUID,
      field: "user_id", // Matches user_id in DDL
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      field: "password_hash", // Matches password_hash in DDL
      allowNull: false,
    },
    userRole: {
      type: DataTypes.ENUM(
        "CommunityMember",
        "LocalAuthority",
        "SystemAdministrator"
      ),
      field: "user_role", // Matches user_role in DDL
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(255),
      field: "first_name", // Matches first_name in DDL
    },
    lastName: {
      type: DataTypes.STRING(255),
      field: "last_name", // Matches last_name in DDL
    },
    registrationDate: {
      type: DataTypes.DATE,
      field: "registration_date", // Matches registration_date in DDL
      defaultValue: DataTypes.NOW,
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      field: "last_login_date", // Matches last_login_date in DDL
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: "is_active", // Matches is_active in DDL
      defaultValue: true,
    },
  },
  {
    timestamps: true, // DDL has created_at and updated_at
    createdAt: "createdAt", // Map createdAt to created_at
    updatedAt: "updatedAt", // Map updatedAt to updated_at
    underscored: true, // Maps camelCase attributes to snake_case columns
    tableName: "users", // Explicitly set table name
  }
);

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = User;
