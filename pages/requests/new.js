import { useState } from 'react';
import { useSession } from 'next-auth/react';

import Formik from 'formik';
import { useQuery } from '@apollo/client';
import GET_BOOKS from '../../lib/graphql/GetBooks.gql';
import CREATE_TRADE from '../../lib/graphql/CreateTrade.gql';

import Layout from '../../lib/components/Layout';
import ErrorNotification from '../../lib/components/ErrorNotification';
import Spinner from '../../lib/components/Spinner';
import BookList from '../../lib/components/BookList';
import CreateTradeBookRow from '../../lib/components/CreateTradeBookRow';

function RequestTrade() {
  const { data: session } = useSession();
  
  const sessionUserId = session?.user.id;

  const {
    data, loading, error, refetch,
  } = useQuery(
    GET_BOOKS,
    {
      variables: { where: JSON.stringify({ available: true }) },
      fetchPolicy: 'network-only',
    },
  );

  const [books, setBooks] = useState([]);

  // invalidate all pending trades containing these books when accepted

  async function onCreateTrade() {
    // // Do both sides have selections? (check for books not owned by current user)
    // const otherUser = books.filter((b) => b.bookUserId !== userId);

    // if (books.length && otherUser.length) {
    //   // Are the selections from the same user?
    //   const firstId = otherUser[0].userId;
    //   if (otherUser.every((o) => o.userId === firstId)) {
    //     const { createTrade, history } = this.props;
    //     await createTrade({ variables: { bookIds: books.map((b) => b.id), userId } });
    //     history.push('/requests/my');
    //   } else {
    //     onError('Choose selections from only one user', false);
    //   }
    // } else {
    //   onError('You need to made selections from both sides', false);
    // }
  }

  async function onClick({ id, userId: bookUserId }) {
    // const { books } = this.state;
    // const book = books.find((b) => b.id === id);
    // if (book) {
    //   this.setState({ books: books.filter((b) => b.id !== id) });
    // } else {
    //   books.push({ id, bookUserId });
    //   this.setState({ books });
    // }
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
                  onClick={onClick}
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
                  onClick={onClick}
                  selected={books.findIndex((b) => b.id === book.id) !== -1}
                />
              )}
            />
          </div>
        </div>
        <div style={{ width: '38em' }}>
          <form>
            <button
              type="button"
              className="btn btn-primary mt-4 mb-4 d-block"
              onClick={onCreateTrade}
            >
              Request Trade
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default RequestTrade;
