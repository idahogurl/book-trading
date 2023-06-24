import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';

import DELETE_MUTATION from '../graphql/DeleteOwnedBook.gql';

import SharedPropTypes from '../propTypes';

import Spinner from './Spinner';
import ErrorNotification from './ErrorNotification';
import Book from './Book';

function DeleteBookButton({ bookId, refetch }) {
  const [deleteMutation, { loading, error, reset }] = useMutation(DELETE_MUTATION);

  if (loading) return <Spinner />;

  return (
    <>
      {error && <ErrorNotification message="Unable to delete book. Please try again." onDismiss={reset} />}
      <button
        type="button"
        id={bookId}
        className="btn btn-danger"
        onClick={async () => {
          await deleteMutation({ variables: { id: bookId } });
          refetch();
        }}
      >
        Delete
      </button>
    </>
  );
}

DeleteBookButton.propTypes = {
  bookId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
};

function MyBookRow({ book, sessionUserId, refetch }) {
  return (
    <Book
      book={book}
      sessionUserId={sessionUserId}
      button={(
        <DeleteBookButton
          bookId={book.id}
          refetch={refetch}
        />
      )}
    />
  );
}

MyBookRow.propTypes = {
  book: SharedPropTypes.book.isRequired,
  sessionUserId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default MyBookRow;
