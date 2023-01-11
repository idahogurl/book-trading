import Sequelize from 'sequelize-cockroachdb';
import configs from '../config/config.json';
import OwnedBook from './ownedBook';
import Trade from './trade';
import TradeBook from './tradeBook';
import User from './user';

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

const db = {
  OwnedBook: OwnedBook(sequelize, Sequelize.DataTypes),
  Trade: Trade(sequelize, Sequelize.DataTypes),
  TradeBook: TradeBook(sequelize, Sequelize.DataTypes),
  User: User(sequelize, Sequelize.DataTypes),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;
