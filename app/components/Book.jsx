import React from 'react';
import PropTypes from 'prop-types';

const Book = function Book(props) {
  const { book } = props;
  return (
    <div className="d-flex">
      <img src={book.imageUrl} alt="" />
      <div className="ml-2">
        <div><strong>Title:</strong> {book.title}</div>
        <div><strong>Published:</strong> {book.publicationYear}</div>
        <div><strong>Author</strong> {book.author}</div>
        {book.user && <div>from {book.user.screenName} in {book.user.location ? book.user.location : 'Unknown'}</div>}
      </div>
    </div>
  );
};

Book.propTypes = {
  book: PropTypes.shape({}).isRequired,
};

export default Book;
