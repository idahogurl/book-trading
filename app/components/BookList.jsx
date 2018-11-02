import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const BookList = function BookList(props) {
  const loginNotice = <Card text="Log in to view books" />;

  const { books, noResultsText } = props;

  const noBooks = noResultsText ? <Card text={props.noResultsText} /> : null;

  if ('currentUser' in sessionStorage === false) {
    return loginNotice;
  }
  return books !== null && books.length !== 0 ? books.map(b => props.render({ book: b })) : noBooks;
};

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  render: PropTypes.func.isRequired,
  noResultsText: PropTypes.string,
};

BookList.defaultProps = {
  noResultsText: 'No Books',
};

export default BookList;
