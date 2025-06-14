// src/models/LocalAuthority.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Assuming User model is defined

const LocalAuthority = sequelize.define(
  "local_authorities",
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
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    areaOfResponsibility: {
      type: DataTypes.STRING(255),
      field: "area_of_responsibility", // Matches area_of_responsibility in DDL
    },
    contactEmail: {
      type: DataTypes.STRING(100),
      field: "contact_email", // Matches contact_email in DDL
    },
  },
  {
    timestamps: false, // DDL shows no createdAt/updatedAt
    underscored: true, // Maps camelCase attributes to snake_case columns
    tableName: "local_authorities", // Explicitly set table name
  }
);

// Association: LocalAuthority belongs to User
LocalAuthority.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasOne(LocalAuthority, {
  foreignKey: "userId",
  sourceKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = LocalAuthority;
