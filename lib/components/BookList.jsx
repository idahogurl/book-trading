import PropTypes from 'prop-types';
import Card from './Card';

const BookList = function BookList({
  books, noResultsText, render, sessionUserId,
}) {
  const loginNotice = <Card text="Log in to view books" />;

  const noBooks = noResultsText ? <Card text={noResultsText} /> : null;

  if (!sessionUserId) {
    return loginNotice;
  }
  return books !== null && books.length !== 0
    ? books.map((b) => render({ book: b })) : noBooks;
};

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  render: PropTypes.func.isRequired,
  noResultsText: PropTypes.string,
  sessionUserId: PropTypes.string,
};

BookList.defaultProps = {
  sessionUserId: undefined,
  noResultsText: 'No Books',
};

export default BookList;
