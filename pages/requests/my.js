// Reject or Accept
// Accepted trades voids pending trades containing these books

import { useSession } from 'next-auth/react';
import { useQuery, useLazyQuery } from '@apollo/client';


import GET_REQUESTS from '../../lib/graphql/GetRequests.gql';
import UPDATE_TRADE from '../../lib/graphql/UpdateTrade.gql';

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

  // TODO: Make button work
  // function onClick(id, status) {
  //   const { updateTrade } = this.props;
  //   updateTrade({ variables: { id, status } });
  // }

  const { loading, error, data } = useQuery(GET_REQUESTS, {
    fetchPolicy: 'network-only',
  });

  const trades = data?.trades || [];

  const tradeRows = trades.map((t) => {
    const books = t.tradeBooks.map((trade) => trade.ownedBook);

    const currentUserBooks = books.filter((b) => b.user.id === sessionUserId);
    const otherUserBooks = books.filter((b) => b.user.id !== sessionUserId);
    const isRequester = t.userId === sessionUserId;
    const requesterName = isRequester ? 'I' : otherUserBooks[0].user.screenName;

    const otherUserBookList = (
      <TradeBookList heading={`${requesterName} ${isRequester ? 'want' : 'wants'}`}>
        <BookList
          books={isRequester ? otherUserBooks : currentUserBooks}
          render={({ book }) => <Book key={book.id} book={book} />}
        />
      </TradeBookList>
    );

    const requesterBookList = (
      <TradeBookList heading={`${requesterName} will give`}>
        <BookList
          books={isRequester ? otherUserBooks : currentUserBooks}
          render={({ book }) => <Book key={book.id} book={book} />}
        />
      </TradeBookList>
    );

    return (
      <RequestedTradeRow
        key={t.id}
        trade={t}
        isRequester={isRequester}
        requesterBookList={requesterBookList}
        otherUserBookList={otherUserBookList}
      />
    );
  });

  const children = sessionUserId ? (
    <>
      {loading ? <Spinner /> : null}
      {error ? <ErrorNotification /> : null}
      {tradeRows}
    </>
  ) : (<Card text="Log in to view your requests" />);

  return (
    <Layout>
      <h1>My Requests</h1>
      {tradeRows.length ? children : <Card text="No requests found" />}
    </Layout>
  );
}

export default MyRequests;
