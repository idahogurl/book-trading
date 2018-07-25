module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Trade', {
    bookId: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'OwnedBook',
        key: 'id',
      },
      field: 'book_id',
    },
    user_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id',
      },
      field: 'user_id',
    },
  }, {
    tableName: 'trades',
    timestamps: true,
    underscored: true,
  });
};
