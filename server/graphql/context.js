import DataLoader from 'dataloader';
import db from '../db/models';

const { Sequelize: { Op }, User, TradeBook } = db;

async function getUsersByIds(ids) {
  return User.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
}

async function getTradeBookByIds(ids) {
  return TradeBook.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
}

export default function context() {
  return {
    userLoader: new DataLoader(getUsersByIds),
    tradeBookLoader: new DataLoader(getTradeBookByIds),
  };
}
