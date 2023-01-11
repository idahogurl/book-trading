import SharedPropTypes from '../utils/propTypes';
import Book from './Book';

function AvailableBookRow(props) {
  const { book } = props;

  return (
    <>
      <Book book={book} />
      <span>
        Requests
        {' '}
        <span className="badge badge-light">{book.requestCount ? book.requestCount : 0}</span>
      </span>
    </>
  );
}

AvailableBookRow.propTypes = {
  book: SharedPropTypes.book.isRequired,
};

export default AvailableBookRow;
