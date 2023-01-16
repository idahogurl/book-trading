import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Formik from 'formik';
import { useQuery, useMutation } from '@apollo/client';

import GET_BOOKS from '../../lib/graphql/GetBooks.gql';
import CREATE_TRADE from '../../lib/graphql/CreateTrade.gql';

import SharedPropTypes from '../../lib/propTypes';

import Layout from '../../lib/components/Layout';
import ErrorNotification from '../../lib/components/ErrorNotification';
import Spinner from '../../lib/components/Spinner';
import BookList from '../../lib/components/BookList';
import CreateTradeBookRow from '../../lib/components/CreateTradeBookRow';

function SubmitTradeForm({ books, sessionUserId }) {
  const [createTrade, { loading, error, reset }] = useMutation(CREATE_TRADE);
  const router = useRouter();

  if (loading) return <Spinner />;
  if (error) return <ErrorNotification onDismiss={reset} />;

  return (
    <Formik
      onSubmit={async () => {
        await createTrade({
          variables: { bookIds: books.map((b) => b.id), userId: sessionUserId },
        });
        router.back();
      }}
      validate={() => {
        const errors = {};
        // Do both sides have selections? (check for books not owned by current user)
        const otherUser = books.filter((b) => b.bookUserId !== sessionUserId);

        if (books.length && otherUser.length) {
          // Are the selections from the same user?
          const firstId = otherUser[0].userId;
          if (!otherUser.every((o) => o.userId === firstId)) {
            errors.trade = 'Choose selections from only one user';
          }
        } else {
          errors.trade = 'You need to made selections from both sides';
        }
        return errors;
      }}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <form onSubmit={handleSubmit}>
          {errors.trade && <div className="text-danger">{errors.trade}</div>}
          <button type="submit" className="btn btn-primary mt-4 mb-4 d-block" disabled={isSubmitting}>
            Request Trade
          </button>
        </form>
      )}
    </Formik>
  );
}

SubmitTradeForm.propTypes = {
  sessionUserId: PropTypes.string.isRequired,
  books: PropTypes.arrayOf(SharedPropTypes.book).isRequired,
};

function RequestTrade() {
  const { data: session } = useSession();

  const sessionUserId = session?.user.id;

  const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
    variables: { where: JSON.stringify({ available: true }) },
    fetchPolicy: 'network-only',
  });

  const [books, setBooks] = useState([]);

  // invalidate all pending trades containing these books when accepted

  function onClick({ id, userId: bookUserId }) {
    const book = books.find((b) => b.id === id);
    if (book) {
      setBooks(books.filter((b) => b.id !== id));
    } else {
      books.push({ id, bookUserId });
      setBooks(books);
    }
  }

  const myBooks = data?.ownedBooks.filter((o) => o.user.id === sessionUserId);
  const availableBooks = data?.ownedBooks.filter((o) => o.user.id !== sessionUserId);

  return (
    <Layout>
      <h1>Create Trade</h1>
      {error && <ErrorNotification />}
      {loading && <Spinner />}
      <div>
        <div className="d-flex flex-wrap">
          <div className="mr-4">
            <h2 className="h3 mt-4">My Books</h2>
            <BookList
              books={myBooks}
              sessionUserId={sessionUserId}
              render={({ book }) => (
                <CreateTradeBookRow
                  key={book.id}
                  book={book}
                  onClick={() => onClick({ id: book.id, bookUserId: sessionUserId })}
                  selected={books.findIndex((b) => b.id === book.id) !== -1}
                />
              )}
            />
          </div>
          <div>
            <h2 className="h3 mt-4">Available Books</h2>
            <BookList
              books={availableBooks}
              sessionUserId={sessionUserId}
              render={({ book }) => (
                <CreateTradeBookRow
                  key={book.id}
                  book={book}
                  onClick={() => onClick({ id: book.id, bookUserId: book.userId })}
                  selected={books.findIndex((b) => b.id === book.id) !== -1}
                />
              )}
            />
          </div>
        </div>
        <div style={{ width: '38em' }}>
          <SubmitTradeForm books={books} sessionUserId={sessionUserId} refetch={refetch} />
        </div>
      </div>
    </Layout>
  );
}

export default RequestTrade;
