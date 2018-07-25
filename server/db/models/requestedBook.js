module.exports = function (sequelize, DataTypes) {
  return sequelize.define('RequestedBook', {
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
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      field: 'user_id',
    },
  }, {
    tableName: 'requested_books',
    timestamps: true,
    underscored: true,
  });
};
