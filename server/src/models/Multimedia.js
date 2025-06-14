// src/models/Multimedia.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Multimedia = sequelize.define(
  "multimedia",
  {
    multimediaId: {
      type: DataTypes.UUID,
      field: "multimedia_id", // Matches multimedia_id in DDL
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    issueId: {
      type: DataTypes.UUID,
      field: "issue_id", // Matches issue_id in DDL
      allowNull: false,
      references: {
        model: "issues", // Refers to the 'issues' table
        key: "issue_id",
      },
    },
    fileType: {
      type: DataTypes.STRING(50),
      field: "file_type", // Matches file_type in DDL
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING(255),
      field: "file_url", // Matches file_url in DDL
      allowNull: false,
    },
    uploadDate: {
      type: DataTypes.DATE,
      field: "upload_date", // Matches upload_date in DDL
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // DDL shows no createdAt/updatedAt
    underscored: true, // Maps camelCase attributes to snake_case columns
    tableName: "multimedia", // Explicitly set table name
  }
);

module.exports = Multimedia;
