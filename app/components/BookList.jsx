import React from 'react';
import PropTypes from 'prop-types';

const BookList = function BookList(props) {
  const noBooks = (
    <div className="card">
      <div className="card-body">
        <div className="card-text">Log in to view your books</div>
      </div>
    </div>);

  return props.books.length !== 0 || 'currentUser' in sessionStorage ?
    props.books.map(b => props.render({ book: b }))
    : noBooks;
};

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  render: PropTypes.func.isRequired,
};

export default BookList;
