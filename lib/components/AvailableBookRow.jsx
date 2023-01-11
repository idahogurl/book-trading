import SharedPropTypes from '../propTypes';

import Book from './Book';

function AvailableBookRow(props) {
  const { book } = props;

  return (
    <>
      <Book book={book} />
      <span>
        Requests
        {' '}
        <span className="badge bg-secondary text-bg-dark">{book.requestCount ? book.requestCount : 0}</span>
      </span>
    </>
  );
}

AvailableBookRow.propTypes = {
  book: SharedPropTypes.book.isRequired,
};

export default AvailableBookRow;
