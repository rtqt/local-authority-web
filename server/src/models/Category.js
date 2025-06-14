
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('categories', {
  categoryId: {
    type: DataTypes.UUID,
    field: 'category_id',
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false,
  underscored: true
});

module.exports = Category;
