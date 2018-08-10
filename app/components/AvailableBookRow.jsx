import React from 'react';
import PropTypes from 'prop-types';

import BookRow from './BookRow';

const AvailableBookRow = function AvailableBookRow(props) {
  const { book } = props;
  const button = (
    <span>
      Requests <span className="badge badge-light">{book.requestCount ? book.requestCount : 0}</span>
    </span>);

  return (
    <div><BookRow book={book} button={button} /></div>
  );
};

AvailableBookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
};

export default AvailableBookRow;
