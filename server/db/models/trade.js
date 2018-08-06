export default function (sequelize, DataTypes) {
  return sequelize.define('Trade', {
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'OwnedBook',
        key: 'id',
      },
      field: 'book_id',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'trades',
    timestamps: true,
    underscored: true,
  });
}
