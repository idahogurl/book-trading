import { models } from '@next-auth/sequelize-adapter';

export default function UserModel(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    ...models.User,
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  });

  User.associate = ({ OwnedBook, Trade }) => {
    User.hasMany(OwnedBook);
    User.hasMany(Trade);
  };

  return User;
}
