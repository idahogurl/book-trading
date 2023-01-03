import PropTypes from 'prop-types';

import Book from './Book';

const AvailableBookRow = function AvailableBookRow(props) {
  const { book } = props;
  const button = (
    <span>
      Requests
      {' '}
      <span className="badge badge-light">{book.requestCount ? book.requestCount : 0}</span>
    </span>
  );

  return <Book book={book} button={button} />;
};

AvailableBookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
};

export default AvailableBookRow;
