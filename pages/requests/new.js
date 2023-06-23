import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import { useMutation, useQuery } from '@apollo/client';

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
      initialValues={{
        trade: '',
      }}
      onSubmit={async () => {
        await createTrade({
          variables: { bookIds: books.map((b) => b.id), userId: sessionUserId },
        });
        router.push('/requests/my');
      }}
      validate={() => {
        const errors = {};
        // Do both sides have selections? (check for books not owned by current user)
        const otherUser = books.filter((b) => b.user.id !== sessionUserId);
        if (books.length - otherUser.length && otherUser.length) {
          // Are the selections from the same user?
          const firstId = otherUser[0].user.id;
          if (!otherUser.every((o) => o.user.id === firstId)) {
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
          {errors.trade && <ErrorNotification message={errors.trade} />}
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

function addBook({
  setBooks, bookToAdd,
}) {
  setBooks((prevState) => {
    // Object.assign would also work
    const book = prevState.find((b) => b.id === bookToAdd.id);
    if (book) {
      // remove book
      return prevState.filter((b) => b.id !== bookToAdd.id);
    }
    return [...prevState, bookToAdd];
  });
}

function RequestForm({ sessionUserId }) {
  const [books, setBooks] = useState([]);

  const {
    data, loading, error, refetch,
  } = useQuery(GET_BOOKS, {
    variables: { where: JSON.stringify({ available: true }) },
    fetchPolicy: 'network-only',
  });

  // TODO: what if there are no books available?
  if (loading) return <Spinner />;
  if (error) return <ErrorNotification onDismiss={refetch} />;

  const myBooks = data?.ownedBooks.filter((o) => o.user.id === sessionUserId);
  const availableBooks = data?.ownedBooks.filter((o) => o.user.id !== sessionUserId);

  return (
    <div>
      {error && <ErrorNotification />}
      {loading && <Spinner />}
      <h2 className="h3 mt-4">My Books</h2>
      <div className="d-flex flex-wrap">
        <BookList
          books={myBooks}
          sessionUserId={sessionUserId}
          render={({ book }) => (
            <RequestTradeBookRow
              key={book.id}
              book={book}
              onClick={() => addBook({
                setBooks,
                bookToAdd: book,
              })}
              selected={books.findIndex((b) => b.id === book.id) !== -1}
            />
          )}
        />
      </div>
      <h2 className="h3 mt-4">Available Books</h2>
      <div className="d-flex flex-wrap">
        <BookList
          books={availableBooks}
          sessionUserId={sessionUserId}
          render={({ book }) => (
            <RequestTradeBookRow
              key={book.id}
              book={book}
              onClick={() => addBook({
                setBooks,
                bookToAdd: book,
              })}
              selected={books.findIndex((b) => b.id === book.id) !== -1}
            />
          )}
        />
      </div>
      <SubmitTradeButton books={books} sessionUserId={sessionUserId} refetch={refetch} />
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
      <h1 className="mt-3 mb-3">Create Trade Request</h1>
      {sessionUserId ? (
        <RequestForm sessionUserId={sessionUserId} />
      ) : (
        <Card text="Log in to create a trade request." />
      )}
    </Layout>
  );
}

export default RequestTrade;
