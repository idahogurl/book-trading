import SharedPropTypes from '../propTypes';
import Book from './Book';

function AvailableBookRow(props) {
  const { book } = props;
  const button = (
    <span>
      Requests
      {' '}
      <span className="badge bg-secondary text-bg-dark">{book.requestCount ? book.requestCount : 0}</span>
    </span>
  );

  return (
    <Book book={book} button={button} />
  );
}

AvailableBookRow.propTypes = {
  book: SharedPropTypes.book.isRequired,
};

export default AvailableBookRow;
