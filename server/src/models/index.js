// src/models/index.js
const sequelize = require("../config/database");
const User = require("./User");
const Category = require("./Category");
const Location = require("./Location");
const Issue = require("./Issue");
const Multimedia = require("./Multimedia");
const Feedback = require("./Feedback");
const CommunityMember = require("./CommunityMember"); // New
const LocalAuthority = require("./LocalAuthority"); // New
const SystemAdministrator = require("./SystemAdministrator"); // New

// Define Associations

// User Associations
User.hasMany(Issue, { foreignKey: "submittedByUserId", as: "submittedIssues" });
User.hasMany(Feedback, {
  foreignKey: "submittedByUserId",
  as: "submittedFeedback",
});

// Issue Associations
Issue.belongsTo(User, { foreignKey: "submittedByUserId", as: "submittedBy" });
Issue.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Issue.belongsTo(Location, { foreignKey: "locationId", as: "location" });
Issue.belongsTo(LocalAuthority, {
  foreignKey: "assignedToAuthorityId",
  as: "assignedTo",
}); // New association
Issue.hasMany(Multimedia, { foreignKey: "issueId", as: "multimedia" });
Issue.hasMany(Feedback, { foreignKey: "issueId", as: "feedback" });

// Category Associations
Category.hasMany(Issue, { foreignKey: "categoryId", as: "issues" });

// Location Associations
Location.hasMany(Issue, { foreignKey: "locationId", as: "issues" });

// Multimedia Associations
Multimedia.belongsTo(Issue, { foreignKey: "issueId", as: "issue" });

// Feedback Associations
Feedback.belongsTo(Issue, { foreignKey: "issueId", as: "issue" });
Feedback.belongsTo(User, {
  foreignKey: "submittedByUserId",
  as: "submittedBy",
});

// Extend User roles:
// These are one-to-one relationships, where the specific role table's PK is also the FK to User.
// These are already defined in the individual model files, but reinforcing here for clarity.
// User.hasOne(CommunityMember, { foreignKey: 'userId', as: 'communityMemberProfile' });
// CommunityMember.belongsTo(User, { foreignKey: 'userId' });

// User.hasOne(LocalAuthority, { foreignKey: 'userId', as: 'localAuthorityProfile' });
// LocalAuthority.belongsTo(User, { foreignKey: 'userId' });

// User.hasOne(SystemAdministrator, { foreignKey: 'userId', as: 'systemAdministratorProfile' });
// SystemAdministrator.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  Category,
  Location,
  Issue,
  Multimedia,
  Feedback,
  CommunityMember,
  LocalAuthority,
  SystemAdministrator,
};

module.exports = db;
