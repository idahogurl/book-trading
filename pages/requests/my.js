import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';

import GET_REQUESTS from '../../lib/graphql/GetRequests.gql';

import Layout from '../../lib/components/Layout';
import Spinner from '../../lib/components/Spinner';
import BookList from '../../lib/components/BookList';
import Book from '../../lib/components/Book';
import Card from '../../lib/components/Card';
import ErrorNotification from '../../lib/components/ErrorNotification';
import { RequestedTradeRow, TradeBookList } from '../../lib/components/RequestedTradeRow';

function MyRequests() {
  const { data: session } = useSession();

  const sessionUserId = session?.user.id;

  // TODO: Improve performance. Will query no matter if user is logged in or not
  // and gets all requests and then filters
  const {
    loading, error, data, refetch,
  } = useQuery(GET_REQUESTS, {
    fetchPolicy: 'network-only',
  });

  const trades = data?.trades || [];

  const tradeRows = trades.map((t) => {
    const books = t.tradeBooks.map((trade) => trade.ownedBook);

    const currentUserBooks = books.filter((b) => b.user.id === sessionUserId);
    const otherUserBooks = books.filter((b) => b.user.id !== sessionUserId);
    const isRequester = t.userId === sessionUserId;
    const requesterName = isRequester ? 'I' : otherUserBooks[0].user.screenName;

    const receivingBookList = (
      <TradeBookList heading={`${requesterName} ${isRequester ? 'want' : 'wants'}`}>
        <BookList
          books={isRequester ? otherUserBooks : currentUserBooks}
          render={({ book }) => <Book key={book.id} book={book} />}
          sessionUserId={sessionUserId}
        />
      </TradeBookList>
    );

    const requestedBookList = (
      <TradeBookList heading={`${requesterName} will give`}>
        <BookList
          books={isRequester ? currentUserBooks : otherUserBooks}
          render={({ book }) => <Book key={book.id} book={book} />}
          sessionUserId={sessionUserId}
        />
      </TradeBookList>
    );

    return (
      <RequestedTradeRow
        key={t.id}
        trade={t}
        isRequester={isRequester}
        requestedBookList={requestedBookList}
        receivingBookList={receivingBookList}
        refetch={refetch}
      />
    );
  });

  const children = sessionUserId ? (
    <>
      {loading ? <Spinner /> : null}
      {error ? <ErrorNotification /> : null}
      {tradeRows?.length ? tradeRows : <Card text="No requests found" />}
    </>
  ) : (
    <Card text="Log in to view your requests" />
  );

  return (
    <Layout>
      <h1 className="mt-3 mb-3">My Requests</h1>
      {children}
    </Layout>
  );
}

export default MyRequests;
