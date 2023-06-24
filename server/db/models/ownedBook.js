import { Sequelize } from 'sequelize-cockroachdb';

export default function OwnedBookModel(sequelize, DataTypes) {
  const OwnedBook = sequelize.define('OwnedBook', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal('DEFAULT'),
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'book_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        references: { model: 'users', key: 'id' },
      },
      field: 'user_id',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'publication_year',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url',
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    indexes: [{
      name: 'owned_book_unique_index',
      method: 'BTREE',
      fields: ['book_id', 'user_id'],
      unique: true,
    }],
    tableName: 'owned_book',
    timestamps: true,
    underscored: true,
  });

  OwnedBook.associate = ({ User, TradeBook }) => {
    OwnedBook.belongsTo(User);
    OwnedBook.hasMany(TradeBook, { foreignKey: 'book_id' });
  };

  return OwnedBook;
}
