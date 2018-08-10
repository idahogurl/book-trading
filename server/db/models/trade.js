export default function (sequelize, DataTypes) {
  const Trade = sequelize.define('Trade', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_id',
      references: { model: 'User', key: 'id' },
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

  Trade.associate = ({ OwnedBook }) => {
    Trade.belongsTo(OwnedBook, { foreignKey: 'book_id' });
  };

  return Trade;
}
