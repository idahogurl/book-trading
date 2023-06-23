import DataLoader from 'dataloader';
import db from '../db/models';

const { Sequelize: { Op }, User, TradeBook } = db;

async function getUsersByIds(ids) {
  const users = await User.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
  const sortOrder = new Map();
  for (let i = 0; i < ids.length; i += 1) {
    sortOrder.set(ids[i], i);
  }
  return users.sort((a, b) => (sortOrder.get(a.id) > sortOrder.get(b.id) ? 1 : -1));
}

async function getTradeBookByIds(ids) {
  const tradeBooks = await TradeBook.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
  const sortOrder = new Map();
  for (let i = 0; i < ids.length; i += 1) {
    sortOrder.set(ids[i], i);
  }
  return tradeBooks.sort((a, b) => (sortOrder.get(a.id) > sortOrder.get(b.id) ? 1 : -1));
}

export default function context() {
  return {
    userLoader: new DataLoader(getUsersByIds),
    tradeBookLoader: new DataLoader(getTradeBookByIds),
  };
}
