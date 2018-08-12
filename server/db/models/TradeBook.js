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
