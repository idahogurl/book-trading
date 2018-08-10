import GraphQLToolTypes from 'graphql-tools-types';
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

export default {
  JSON: GraphQLToolTypes.JSON({ name: 'JSON' }),
  Date: GraphQLToolTypes.Date({ name: 'Date' }),
  Void: GraphQLToolTypes.Void({ name: 'Void' }),
  Mutation: {
    createOwnedBook: async (_, { input }) => {
      const ownedBook = OwnedBook.create(input);
      return ownedBook;
    },
    deleteOwnedBook: async (_, { id }) => {
      await OwnedBook.destroy({
        where: { id },
      });
      return id;
    },
    createTrade: async (_, { userId }) => {
      const trade = Trade.create({
        userId,
      });
      return trade;
    },
    updateTrade: async (_, { id, status }) => {
      const trade = Trade.findById(id);
      trade.setStatus(status);
      trade.update();
    },
    deleteTrade: async (_, { id }) => {
      // delete all the trade books
      await Trade.destroy({
        where: { id },
      });
      return { id };
    },
    createTradeBook: async (_, { tradeId, bookId }) => {
      const tradeBook = await TradeBook.create({
        tradeId,
        bookId,
      });
      return tradeBook;
    },
    deleteTradeBook: async (_, { tradeId, bookId }) => {
      await Trade.destroy({
        where: { tradeId, bookId },
      });
      return { tradeId, bookId };
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
      const books = await User.findAll(limit, parseOrder(order), parseWhere(where), offset);
      return books;
    },
    user: async (_, { id }) => {
      const user = await User.findById({ where: { id } });
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
};
