export default function (sequelize, DataTypes) {
  const TradeBook = sequelize.define('TradeBook', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    tradeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Trade',
        key: 'id',
      },
      field: 'trade_id',
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'OwnedBook',
        key: 'id',
      },
      field: 'book_id',
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      field: 'user_id',
    },
    isRequester: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_requester',
    },
  }, {
    tableName: 'trade_books',
    timestamps: true,
    underscored: true,
  });

  TradeBook.associate = ({ OwnedBook, Trade }) => {
    TradeBook.belongsTo(OwnedBook, { foreignKey: 'book_id' });
    TradeBook.belongsTo(Trade);
  };

  return TradeBook;
}
