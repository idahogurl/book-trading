import GraphQLToolTypes from 'graphql-tools-types';
import { Op } from 'sequelize-cockroachdb';
import { v4 as uuid } from 'uuid';
import db from '../db/models';
import goodReadsRequest from './goodreads';

const {
  Trade, OwnedBook, TradeBook, User,
} = db;

const parseOrder = function parseOrder(order) {
  if (order) {
    const columns = order.split(', ');
    const columnOrder = columns.map((c) => c.split(' '));
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
  return Trade.update(
    { status: 3 },
    {
      where: {
        id: {
          [Op.in]: db.sequelize.literal(`(SELECT trade_id FROM trade_books WHERE book_id IN ('${bookIds}'))`),
        },
        status: 0,
      },
      transaction,
    },
  );
};

const resolvers = {
  UUID: GraphQLToolTypes.UUID({ name: 'UUID', storage: 'string' }),
  JSON: GraphQLToolTypes.JSON({ name: 'JSON' }),
  Date: GraphQLToolTypes.Date({ name: 'Date' }),
  Void: GraphQLToolTypes.Void({ name: 'Void' }),
  Mutation: {
    createOwnedBook: async (_, { input }) => db.sequelize
      .transaction(async (transaction) => {
        const { bookId, userId } = input;
        const existing = await OwnedBook.findOne({ where: { bookId, userId } }, { transaction });
        if (existing) {
          existing.set('available', 1);
          await existing.save({ transaction });
          return existing;
        }
        const ownedBook = await OwnedBook.create(input, { transaction });
        return ownedBook;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      }),
    deleteOwnedBook: (_, { id }) => db.sequelize
      .transaction(async (transaction) => {
        const ownedBook = await OwnedBook.findById(id, { transaction });
        ownedBook.set('available', false);
        await ownedBook.save({ transaction });

        await voidTrade(id, transaction);
      })
      .catch((err) => {
        console.error(err);
        throw err;
      }),
    createTrade: (_, { bookIds, userId }) => {
      const trade = {
        id: uuid(),
        userId,
        status: 0,
        createdAt: new Date(),
      };
      const tradeBooks = bookIds.map((bookId) => ({
        id: uuid(),
        tradeId: trade.id,
        bookId,
        userId,
        isRequester: true,
      }));

      return db.sequelize
        .transaction(async (transaction) => {
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
      // Update trade status
      const trade = await Trade.findById(id);
      trade.set('status', status);

      // If trade is accepted, then:
      // Set books of trade as unavailable
      // Void pending trades containing these books
      if (status === 1) {
        db.sequelize
          .transaction(async (transaction) => {
            await trade.save({ transaction });
            const tradeBooks = await trade.getTradeBooks({ transaction });
            const bookIds = tradeBooks.map((b) => b.bookId);

            // Set books unavailable
            await OwnedBook.update(
              { available: false },
              {
                where: {
                  id: {
                    [Op.in]: bookIds,
                  },
                },
                transaction,
              },
            );

            return voidTrade(bookIds.join("','"), transaction);
          })
          .then(() => trade)
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
        id,
        fullName,
        location,
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
        group: ['TradeBooks.id', 'OwnedBook.id'],
        include: [{ model: TradeBook }],
        attributes: {
          include: [
            [db.sequelize.fn('COUNT', db.sequelize.col('TradeBooks.book_id')), 'tradeCount'],
          ],
        },
      });

      // Exclude books current user is giving

      return books.map((b) => {
        const book = b;
        book.requestCount = book.dataValues.requestCount;
        return book;
      });
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
    goodreads: async (_, { q, field, userId }) => {
      const books = await goodReadsRequest({ q, field, userId });
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

export default resolvers;
