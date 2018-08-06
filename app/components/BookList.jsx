import React from 'react';
import PropTypes from 'prop-types';

// Show No Results Found

const BookList = function BookList(props) {
  return (
    <ul className="list-group w-75 mr-auto ml-auto">
      {props.books.map(b => props.render({ book: b }))}
    </ul>);
};

// view the books I own

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  render: PropTypes.func.isRequired,
};

export default BookList;
