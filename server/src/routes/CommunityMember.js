// src/models/CommunityMember.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Assuming User model is defined

const CommunityMember = sequelize.define(
  "community_members",
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
    phoneNumber: {
      type: DataTypes.STRING(30),
      field: "phone_number", // Matches phone_number in DDL
      unique: true,
    },
    residentialAddress: {
      type: DataTypes.STRING(255),
      field: "residential_address", // Matches residential_address in DDL
    },
    preferredLanguage: {
      type: DataTypes.STRING(50),
      field: "preferred_language", // Matches preferred_language in DDL
      defaultValue: "English",
    },
    firstName: {
      type: DataTypes.STRING(100),
      field: "first_name", // Matches first_name in DDL
    },
    lastName: {
      type: DataTypes.STRING(100),
      field: "last_name", // Matches last_name in DDL
    },
    proofOfAddress: {
      type: DataTypes.STRING(255),
      field: "proof_of_address", // Matches proof_of_address in DDL
    },
    profileImage: {
      type: DataTypes.STRING(255),
      field: "profile_image", // Matches profile_image in DDL
    },
  },
  {
    timestamps: false, // DDL shows no createdAt/updatedAt
    underscored: true, // Maps camelCase attributes to snake_case columns
    tableName: "community_members", // Explicitly set table name
  }
);

// Association: CommunityMember belongs to User
CommunityMember.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasOne(CommunityMember, {
  foreignKey: "userId",
  sourceKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = CommunityMember;
