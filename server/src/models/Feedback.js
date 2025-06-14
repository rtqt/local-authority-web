// src/models/Feedback.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Feedback = sequelize.define(
  "feedback",
  {
    feedbackId: {
      type: DataTypes.UUID,
      field: "feedback_id", // Matches feedback_id in DDL
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
    submittedByUserId: {
      type: DataTypes.UUID,
      field: "submitted_by_user_id", // Matches submitted_by_user_id in DDL
      references: {
        model: "users", // Refers to the 'users' table
        key: "user_id",
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    submissionDate: {
      type: DataTypes.DATE,
      field: "submission_date", // Matches submission_date in DDL
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // DDL shows no createdAt/updatedAt
    underscored: true, // Maps camelCase attributes to snake_case columns
    tableName: "feedback", // Explicitly set table name
  }
);

module.exports = Feedback;
