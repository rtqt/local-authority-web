
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunityMember = sequelize.define('community_members', {
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    primaryKey: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  phoneNumber: {
    type: DataTypes.STRING(30),
    field: 'phone_number',
    unique: true,
    validate: {
      is: /^[\+]?[1-9][\d]{0,15}$/
    }
  },
  residentialAddress: {
    type: DataTypes.STRING,
    field: 'residential_address'
  },
  preferredLanguage: {
    type: DataTypes.STRING(50),
    field: 'preferred_language',
    defaultValue: 'English'
  },
  proofOfAddress: {
    type: DataTypes.STRING,
    field: 'proof_of_address'
  },
  firstName: {
    type: DataTypes.STRING(100),
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    field: 'last_name'
  },
  profileImage: {
    type: DataTypes.STRING,
    field: 'profile_image'
  }
}, {
  timestamps: false,
  underscored: true
});

module.exports = CommunityMember;
