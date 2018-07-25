import GraphQLToolTypes from 'graphql-tools-types';
import { OwnedBook, RequestedBook, Trade, User } from '../db/models'

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
    createOwnedBook: async (userId) => {
      const ownedBook = OwnedBook.create({
        id: uuid(),
        userId,
      })
      return ownedBook
    },
    deleteOwnedBook: async (id) => {
      await OwnedBook.destroy({
        where: { id },
      })
      return id
    },
    createRequestedBook: async (bookId, userId) => {
      const requestedBook = await RequestedBook.create({
        userId,
        bookId,
      })
      return requestedBook
    },
    deleteRequestedBook: async (id) => {
      await RequestedBook.destroy({
        where: { id }
      })
      return id
    },
    createTrade: async (bookId, userId) => {
      const trade = Trade.create({
        bookId,
        userId,
      })
      return trade
    },
    deleteTrade: async (bookId, userId) => {
      await Trade.destroy({
        where: { bookId, userId }
      })
      return { bookId, userId }
    },
    createUser: async (id, fullName, location) => {
      const user = User.create({
        id, fullName, location
      })
      return user
    },
    updateUser: async (id, fullName, location) => {
      const user = await User.findById(id)
      await user.update({ fullName, location })
      return user
    },
},
Query: {
  ownedBooks: async (limit, order, where, offset) => {
    const books = await OwnedBooks.findAll(limit, parseOrder(order), parseWhere(where), offset)
    return books
  },
  ownedBook: async (id, where) => {
    const book = await OwnedBooks.findById(id, where)
  },
  requestedBooks: async (limit, order, where, offset) => {
    const books = await RequestedBook.findAll(limit, parseOrder(order), parseWhere(where), offset)
    return books
  },
  requestedBook: async (bookId, userId) => {
    const book = await RequestedBook.findOne({ where: { bookId, userId }})
  },
  trades: async (limit, order, where, offset) => {
    const trades = await trades.findAll(limit, parseOrder(order), parseWhere(where), offset)
    return trades
  },
  trade: async (bookId, userId) => {

  },
  users: async (limit, order, where, offset) => {

  },
  user: async (id, where) => {

  }
}
