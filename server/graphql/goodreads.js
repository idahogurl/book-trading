import fetch from 'node-fetch';
import { Op } from 'sequelize-cockroachdb';
import db from '../db/models';

const goodReadsRequest = async function goodReadsRequest({ q, field, userId }) {
  try {
    const queryField = field === 'isbn' ? field : `in${field}`;
    const apiUrl = 'https://www.googleapis.com/books/v1/volumes';
    const params = new URLSearchParams({
      key: process.env.GOOGLE_BOOKS_API_KEY,
      q: `${queryField}:${q}`,
      fields: 'items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/imageLinks/thumbnail)',
    });

    const data = await fetch(`${apiUrl}?${params.toString()}`);
    const results = await data.json();

    const books = results.items.map((w) => ({
      publicationYear: w.volumeInfo.publishedDate.split('-')[0],
      id: w.id,
      title: w.volumeInfo.title,
      author: Array.isArray(w.volumeInfo.authors) ? w.volumeInfo.authors[0] : null,
      imageUrl: w.volumeInfo.imageLinks?.thumbnail,
    }));

    const ids = books.map((b) => b.id);
    const ownedBooks = userId ? await db.OwnedBook.findAll({
      where: { book_id: { [Op.in]: ids }, userId },
    }) : [];

    ownedBooks.forEach((o) => {
      const index = books.findIndex((b) => b.id === o.bookId);
      books[index].userId = o.userId;
      books[index].available = o.available;
    });

    return books;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default goodReadsRequest;
