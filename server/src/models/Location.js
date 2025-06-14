// src/models/Location.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Location = sequelize.define(
  "locations",
  {
    locationId: {
      type: DataTypes.UUID,
      field: "location_id", // Matches location_id in DDL
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    addressText: {
      type: DataTypes.TEXT,
      field: "address_text", // Matches address_text in DDL
    },
    city: {
      type: DataTypes.STRING(100),
    },
    country: {
      type: DataTypes.STRING(100),
      defaultValue: "Ethiopia",
    },
  },
  {
    timestamps: false, // DDL shows no createdAt/updatedAt
    underscored: true, // Maps camelCase attributes to snake_case columns
    tableName: "locations", // Explicitly set table name
  }
);

module.exports = Location;
