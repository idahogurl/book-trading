import PropTypes from 'prop-types';

import SharedPropTypes from '../utils/propTypes';

import Book from './Book';

function MyBookRow({ deleteMutation, book, onDeleteClick }) {
  const button = (
    <button
      type="button"
      id={book.id}
      className="btn btn-danger"
      onClick={async () => {
        await deleteMutation({ variables: { id: book.id } });
        onDeleteClick();
      }}
    >
      Delete
    </button>
  );

  return <Book book={book} button={button} />;
}

MyBookRow.propTypes = {
  book: SharedPropTypes.book.isRequired,
  deleteMutation: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default MyBookRow;
