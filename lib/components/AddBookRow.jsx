import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import cs from 'classnames';

import SharedPropTypes from '../propTypes';
import Book from './Book';

import CREATE_MUTATION from '../graphql/CreateOwnedBook.gql';

function AddBookRow({ book, sessionUserId }) {
  const [createMutation, { data, loading, error }] = useMutation(CREATE_MUTATION);

  async function onClick() {
    if (sessionUserId !== undefined) {
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
    } else {
      // notify('Login to add books');
      // TODO: Show toast
    }
  }

  const isLoggedIn = sessionUserId !== undefined;
  const button = (
    <button
      type="button"
      onClick={onClick}
      className={cs('btn btn-primary', { disabled: isLoggedIn && book.userId })}
    >
      {isLoggedIn && book.userId ? 'Book is Owned' : 'Add to Owned'}
    </button>
  );
  return <Book book={data?.createOwnedBook || book} button={button} />;
}

AddBookRow.propTypes = {
  book: SharedPropTypes.book.isRequired,
  sessionUserId: PropTypes.string,
};

AddBookRow.defaultProps = {
  sessionUserId: undefined,
};

export default AddBookRow;
