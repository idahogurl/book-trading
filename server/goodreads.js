import dotenv from 'dotenv';
import { get } from 'axios';
import { Parser } from 'xml2js';
import { Op } from 'sequelize';
import { OwnedBook } from './db/models';

dotenv.config();

const goodReadsRequest = async function goodReadsRequest({ q, field, userId }) {
  try {
    const apiUrl = 'https://www.goodreads.com/search';

    const params = {
      key: process.env.GOODREADS_KEY,
      q,
      'search[field]': field,
    };
    const { data } = await get(apiUrl, { params });
    const parser = new Parser({ strict: false });

    const promise = new Promise((resolve, reject) => {
      parser.parseString(data, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const response = await promise;

    const books = response.GOODREADSRESPONSE.SEARCH[0].RESULTS[0].WORK.map(w => ({
      publicationYear: w.ORIGINAL_PUBLICATION_YEAR[0]._,
      id: w.BEST_BOOK[0].ID[0]._,
      title: w.BEST_BOOK[0].TITLE[0],
      author: w.BEST_BOOK[0].AUTHOR[0].NAME[0],
      imageUrl: w.BEST_BOOK[0].IMAGE_URL[0],
    }));

    const ids = books.map(b => b.id);
    const ownedBooks = await OwnedBook.findAll({
      where: { book_id: { [Op.in]: ids }, userId },
    });

    ownedBooks.forEach((o) => {
      const index = books.findIndex(b => b.id === o.bookId);
      books[index].owned = true;
    });

    return books;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default goodReadsRequest;
