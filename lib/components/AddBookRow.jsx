import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import cs from 'classnames';

import CREATE_MUTATION from '../graphql/CreateOwnedBook.gql';

import SharedPropTypes from '../propTypes';
import Spinner from './Spinner';
import Book from './Book';
import ErrorNotification from './ErrorNotification';

function AddBookButton({ book, sessionUserId }) {
  const isLoggedIn = sessionUserId !== undefined;

  const [createMutation, { data, loading, error }] = useMutation(CREATE_MUTATION);

  const displayBook = data?.createOwnedBook || book;

  async function onClick() {
    const {
      id, title, author, imageUrl, publicationYear,
    } = book;

    const input = {
      bookId: id,
      title,
      author,
      imageUrl,
      publicationYear,
      userId: sessionUserId,
      available: true,
    };

    await createMutation({ variables: { input } });
  }

  if (loading) return <Spinner />;

  return (
    <>
      {error && <ErrorNotification message="Unable to add book. Please try again." />}
      <button
        type="button"
        onClick={onClick}
        className={cs('btn btn-primary', {
          disabled: isLoggedIn && displayBook.userId,
        })}
      >
        {isLoggedIn && displayBook.userId ? 'Book is Owned' : 'Add to Owned'}
      </button>
    </>
  );
}

AddBookButton.propTypes = {
  book: SharedPropTypes.book.isRequired,
  sessionUserId: PropTypes.string,
};

AddBookButton.defaultProps = {
  sessionUserId: undefined,
};

function AddBookRow({ book, sessionUserId }) {
  const button = (
    <AddBookButton book={book} sessionUserId={sessionUserId} />
  );
  return <Book book={book} button={button} />;
}

AddBookRow.propTypes = {
  book: SharedPropTypes.book.isRequired,
  sessionUserId: PropTypes.string,
};

AddBookRow.defaultProps = {
  sessionUserId: undefined,
};

export default AddBookRow;
