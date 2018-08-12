import React from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

const BookRow = function BookRow(props) {
  const { book, button } = props;
  return (
    <li className="list-group-item d-flex">
      <div className="d-flex justify-content-between">
        <Book book={book} />
        <div className="float-right">
          {button}
        </div>
      </div>
    </li>);
};

BookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
  button: PropTypes.element,
};

BookRow.defaultProps = {
  button: null,
};

export default BookRow;
