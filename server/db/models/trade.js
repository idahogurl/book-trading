export default function TradeModel(sequelize, DataTypes) {
  const Trade = sequelize.define('Trade', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: { model: 'User', key: 'id' },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  }, {
    tableName: 'trade',
    timestamps: true,
    underscored: true,
  });

  Trade.associate = ({ User, TradeBook }) => {
    Trade.belongsTo(User);
    Trade.hasMany(TradeBook);
  };

  return Trade;
}
