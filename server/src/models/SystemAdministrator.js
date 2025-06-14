// src/models/SystemAdministrator.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Assuming User model is defined

const SystemAdministrator = sequelize.define(
  "system_administrators",
  {
    userId: {
      // This will be the primary key and foreign key to users table
      type: DataTypes.UUID,
      field: "user_id", // Matches user_id in DDL
      primaryKey: true,
      allowNull: false,
      references: {
        model: "users", // Refers to the 'users' table
        key: "user_id",
      },
    },
    adminLevel: {
      type: DataTypes.ENUM("SuperAdmin", "Moderator", "Support"),
      field: "admin_level", // Matches admin_level in DDL
      allowNull: false,
    },
  },
  {
    timestamps: false, // DDL shows no createdAt/updatedAt
    underscored: true, // Maps camelCase attributes to snake_case columns
    tableName: "system_administrators", // Explicitly set table name
  }
);

// Association: SystemAdministrator belongs to User
SystemAdministrator.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasOne(SystemAdministrator, {
  foreignKey: "userId",
  sourceKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = SystemAdministrator;
