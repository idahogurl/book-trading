export default function (sequelize, DataTypes) {
  return sequelize.define('TradeBook', {
    trade_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Trade',
        key: 'id',
      },
      field: 'trade_id',
    },
    book_id: {
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
}
