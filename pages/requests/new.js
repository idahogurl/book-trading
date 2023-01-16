import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import { useMutation, useLazyQuery } from '@apollo/client';

import GET_BOOKS from '../../lib/graphql/GetBooks.gql';
import CREATE_TRADE from '../../lib/graphql/CreateTrade.gql';

import SharedPropTypes from '../../lib/propTypes';

import Layout from '../../lib/components/Layout';
import Card from '../../lib/components/Card';
import ErrorNotification from '../../lib/components/ErrorNotification';
import Spinner from '../../lib/components/Spinner';
import BookList from '../../lib/components/BookList';
import RequestTradeBookRow from '../../lib/components/RequestTradeBookRow';

function SubmitTradeButton({ books, sessionUserId }) {
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
          <button
            type="submit"
            className="btn btn-primary mt-4 mb-4 d-block"
            disabled={!sessionUserId || isSubmitting}
          >
            Request Trade
          </button>
        </form>
      )}
    </Formik>
  );
}

SubmitTradeButton.propTypes = {
  sessionUserId: PropTypes.string,
  books: PropTypes.arrayOf(SharedPropTypes.book).isRequired,
};

SubmitTradeButton.defaultProps = {
  sessionUserId: undefined,
};

function RequestForm({ sessionUserId }) {
  const {
    data, loading, error, refetch,
  } = useLazyQuery(GET_BOOKS, {
    variables: { where: JSON.stringify({ available: true }) },
    fetchPolicy: 'network-only',
  });

  const [books, setBooks] = useState([]);

  function addBook({ id, userId: bookUserId }) {
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
    <div>
      {error && <ErrorNotification />}
      {loading && <Spinner />}
      <div className="d-flex flex-wrap">
        <div className="mr-4">
          <h2 className="h3 mt-4">My Books</h2>
          <BookList
            books={myBooks}
            sessionUserId={sessionUserId}
            render={({ book }) => (
              <RequestTradeBookRow
                key={book.id}
                book={book}
                onClick={() => addBook({
                  id: book.id,
                  bookUserId: sessionUserId,
                })}
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
              <RequestTradeBookRow
                key={book.id}
                book={book}
                onClick={() => addBook({
                  id: book.id,
                  bookUserId: book.userId,
                })}
                selected={books.findIndex((b) => b.id === book.id) !== -1}
              />
            )}
          />
        </div>
      </div>
      <div
        style={{
          width: '38em',
        }}
      >
        <SubmitTradeButton books={books} sessionUserId={sessionUserId} refetch={refetch} />
      </div>
    </div>
  );
}

RequestForm.propTypes = {
  sessionUserId: PropTypes.string.isRequired,
};

function RequestTrade() {
  // invalidate all pending trades containing these books when accepted

  const { data: session } = useSession();
  const sessionUserId = session?.user.id;

  return (
    <Layout>
      <h1 className="mt-3 mb-3">Create Trade</h1>
      {sessionUserId ? (
        <RequestForm sessionUserId={sessionUserId} />
      ) : (
        <Card text="Log in to create a trade request." />
      )}
    </Layout>
  );
}

export default RequestTrade;
