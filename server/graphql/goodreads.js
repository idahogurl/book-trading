import fetch from 'node-fetch';
import { Parser } from 'xml2js';
import { Op } from 'sequelize-cockroachdb';
import db from '../db/models';

const goodReadsRequest = async function goodReadsRequest({ q, field, userId }) {
  try {
    const apiUrl = 'https://www.goodreads.com/search';
    const params = new URLSearchParams({
      key: process.env.GOODREADS_KEY,
      q,
      'search[field]': field,
    });

    const data = await fetch(`${apiUrl}?${params.toString()}`);
    const results = await data.text();
    const parser = new Parser({ strict: false });

    const promise = new Promise((resolve, reject) => {
      parser.parseString(results, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const response = await promise;

    /*
    <results-start>1</results-start>
<results-end>20</results-end>
<total-results>906</total-results>
    */
   
    const books = response.GOODREADSRESPONSE.SEARCH[0].RESULTS[0].WORK.map((w) => ({
      publicationYear: w.ORIGINAL_PUBLICATION_YEAR[0]._,
      id: w.BEST_BOOK[0].ID[0]._,
      title: w.BEST_BOOK[0].TITLE[0],
      author: w.BEST_BOOK[0].AUTHOR[0].NAME[0],
      imageUrl: w.BEST_BOOK[0].IMAGE_URL[0],
    }));

    const ids = books.map((b) => b.id);
    const ownedBooks = userId ? await db.OwnedBook.findAll({
      where: { book_id: { [Op.in]: ids }, userId },
    }) : [];

    ownedBooks.forEach((o) => {
      const index = books.findIndex((b) => b.id === o.bookId);
      books[index].userId = userId;
    });

    return books;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default goodReadsRequest;
