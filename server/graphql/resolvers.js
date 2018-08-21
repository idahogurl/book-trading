import GraphQLToolTypes from 'graphql-tools-types';
import { Op } from 'sequelize';
import uuid from 'uuid/v4';
import db, { OwnedBook, Trade, TradeBook, User } from '../db/models';
import goodReadsRequest from '../goodreads';

const parseOrder = function parseOrder(order) {
  if (order) {
    const columns = order.split(', ');
    const columnOrder = columns.map(c => c.split(' '));
    return columnOrder;
  }
  return [];
};

const parseWhere = function parseWhere(where) {
  if (where) {
    return JSON.parse(where);
  }
  return {};
};

const voidTrade = function voidTrade(bookIds, transaction) {
  return Trade.update({ status: 3 }, {
    where: {
      id: {
        [Op.in]:
          db.sequelize.literal(`(SELECT trade_id FROM trade_books WHERE book_id IN ('${bookIds}'))`),
      },
      status: 0,
    },
    transaction,
  });
};

export default {
  JSON: GraphQLToolTypes.JSON({ name: 'JSON' }),
  Date: GraphQLToolTypes.Date({ name: 'Date' }),
  Void: GraphQLToolTypes.Void({ name: 'Void' }),
  Mutation: {
    createOwnedBook: async (_, { input }) => {
      const ownedBook = OwnedBook.create(input);
      return ownedBook;
    },
    deleteOwnedBook: (_, { id }) => db.sequelize.transaction(async (transaction) => {
      const ownedBook = await OwnedBook.findById(id, { transaction });
      ownedBook.set('available', false);
      await ownedBook.save({ transaction });

      await voidTrade(id, transaction);
    }).catch((err) => {
      console.error(err);
      throw err;
    }),
    createTrade: (_, { bookIds }, user) => {
      const trade = {
        id: uuid(), userId: user.id, status: 0, createdAt: new Date(),
      };
      const tradeBooks = bookIds.map(bookId => ({ id: uuid(), tradeId: trade.id, bookId }));

      return db.sequelize.transaction(async (transaction) => {
        await Trade.create(trade, { transaction });
        await TradeBook.bulkCreate(tradeBooks, { transaction });
        return { trade, tradeBooks };
      })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    },
    updateTrade: async (_, { id, status }) => {
      const trade = await Trade.findById(id);
      trade.set('status', status);

      // Void pending trades containing these books when trade is accepted
      if (status === 1) {
        return db.sequelize.transaction(async (transaction) => {
          await trade.save({ transaction });
          const tradeBooks = await trade.getTradeBooks({ transaction });
          const bookIds = tradeBooks.map(b => b.bookId).join('\',\'');
          return voidTrade(bookIds, transaction);
        })
          .catch((err) => {
            console.error(err);
            throw err;
          });
      }
      await trade.save();

      return trade;
    },
    createUser: async (_, { id, fullName, location }) => {
      const user = User.create({
        id, fullName, location,
      });
      return user;
    },
    updateUser: async (_, { id, fullName, location }) => {
      const user = await User.findById(id);
      await user.update({ fullName, location });
      return user;
    },
  },
  Query: {
    ownedBooks: async (_, {
      limit, order, where, offset,
    }) => {
      const books = await OwnedBook.findAll({
        limit,
        order: parseOrder(order),
        where: parseWhere(where),
        offset,
        group: 'OwnedBook.id',
        include: [
          { model: TradeBook },
        ],
        attributes: {
          include: [
            [db.sequelize.fn('COUNT', db.sequelize.col('TradeBooks.book_id')), 'requestCount'],
          ],
        },
      });
      return books;
    },
    ownedBook: async (_, { id }) => {
      const book = await OwnedBook.findById(id);
      return book;
    },
    trades: async (_, {
      limit, order, where, offset,
    }) => {
      const trades = await Trade.findAll(limit, parseOrder(order), parseWhere(where), offset);
      return trades;
    },
    trade: async (_, { bookId, userId }) => {
      const trade = await Trade.findOne({ where: { bookId, userId } });
      return trade;
    },
    users: async (_, {
      limit, order, where, offset,
    }) => {
      const users = await User.findAll(limit, parseOrder(order), parseWhere(where), offset);
      return users;
    },
    user: async (_, { id }) => {
      const user = await User.findById(id);
      return user;
    },
    goodreads: async (_, { q, field }, user) => {
      const books = await goodReadsRequest({ q, field, userId: user.id });
      return books;
    },
  },
  OwnedBook: {
    user: async (book) => {
      const user = await book.getUser();
      return user;
    },
  },
  Trade: {
    tradeBooks: async (trade) => {
      const books = await trade.getTradeBooks();
      return books;
    },
  },
  TradeBook: {
    ownedBook: async (tradeBook) => {
      const ownedBook = await tradeBook.getOwnedBook();
      return ownedBook;
    },
  },
};
