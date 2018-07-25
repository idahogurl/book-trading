module.exports = function (sequelize, DataTypes) {
  const OwnedBook = sequelize.define('OwnedBook', {
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'user_id',
    },
  }, {
    tableName: 'owned_books',
    timestamps: true,
    underscored: true,
  });

  OwnedBook.associate = ({ User, RequestedBook, Trade }) => {
    OwnedBook.belongsTo(User);
    OwnedBook.hasMany(Trade);
    OwnedBook.hasMany(RequestedBook);
  };
  return OwnedBook;
};
