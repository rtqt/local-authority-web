// src/models/Issue.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Issue = sequelize.define(
  "issues",
  {
    issueId: {
      type: DataTypes.UUID,
      field: "issue_id", // Matches issue_id in DDL
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(255), // DDL specifies VARCHAR(255)
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM(
        "Reported",
        "In Progress",
        "Resolved",
        "Closed",
        "Rejected"
      ),
      defaultValue: "Reported",
      allowNull: false, // DDL specifies NOT NULL
      validate: {
        isIn: [["Reported", "In Progress", "Resolved", "Closed", "Rejected"]],
      },
    },
    // *** IMPORTANT: Adding priority field based on your frontend code ***
    // You MUST add this column to your 'issues' table in the database schema.
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium", // Default value, adjust as needed
      allowNull: false, // Assuming it's always set
    },
    submissionDate: {
      type: DataTypes.DATE,
      field: "submission_date", // Matches submission_date in DDL
      defaultValue: DataTypes.NOW,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      field: "last_updated", // Matches last_updated in DDL
      defaultValue: DataTypes.NOW,
      // Sequelize's built-in `updatedAt` will handle this if timestamps: true
      // If timestamps: false, you'll need hooks:
    },
    resolutionDate: {
      type: DataTypes.DATE,
      field: "resolution_date", // Matches resolution_date in DDL
    },
    submittedByUserId: {
      type: DataTypes.UUID,
      field: "submitted_by_user_id", // Matches submitted_by_user_id in DDL
      allowNull: false,
      references: {
        model: "users", // Refers to the 'users' table
        key: "user_id",
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      field: "category_id", // Matches category_id in DDL
      allowNull: false,
      references: {
        model: "categories", // Refers to the 'categories' table
        key: "category_id",
      },
    },
    locationId: {
      type: DataTypes.UUID,
      field: "location_id", // Matches location_id in DDL
      references: {
        model: "locations", // Refers to the 'locations' table
        key: "location_id",
      },
    },
    assignedToAuthorityId: {
      type: DataTypes.UUID,
      field: "assigned_to_authority_id", // Matches assigned_to_authority_id in DDL
      references: {
        model: "local_authorities", // Refers to the 'local_authorities' table
        key: "user_id",
      },
    },
  },
  {
    // `timestamps: true` will automatically add `createdAt` and `updatedAt` columns.
    // However, your DDL defines `submission_date` and `last_updated` manually.
    // To align, we keep `timestamps: false` and manage these dates manually or via hooks.
    // Your DDL has `last_updated` with `ON UPDATE CURRENT_TIMESTAMP`. Sequelize's `updatedAt` handles this.
    // Let's use `timestamps: true` and map them, as it's cleaner.
    timestamps: true,
    createdAt: "submissionDate", // Map createdAt to submission_date
    updatedAt: "lastUpdated", // Map updatedAt to last_updated
    underscored: true, // Maps camelCase attributes to snake_case columns
    tableName: "issues", // Explicitly set table name
    hooks: {
      // If you want resolutionDate to be set automatically when status changes to 'Resolved'
      // You'll need to handle this logic in your controller before calling update.
      // The previous `beforeUpdate` hook for `lastUpdated` is now handled by `updatedAt: 'lastUpdated'`
    },
  }
);

module.exports = Issue;
