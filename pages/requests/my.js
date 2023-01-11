// Reject or Accept
// Accepted trades voids pending trades containing these books

import PropTypes from 'prop-types';
import { useSession } from 'next-auth/react';
import { useQuery, useLazyQuery } from '@apollo/client';

import StatusEnum from '../../lib/statusEnum';

import GET_REQUESTS from '../../lib/graphql/GetRequests.gql';
import UPDATE_TRADE from '../../lib/graphql/UpdateTrade.gql';

import Layout from '../../lib/components/Layout';
import Spinner from '../../lib/components/Spinner';
import BookList from '../../lib/components/BookList';
import Book from '../../lib/components/Book';
import Card from '../../lib/components/Card';
import ErrorNotification from '../../lib/components/ErrorNotification';

function TradeActionRow({ trade, onClick }) {
  return (
    <>
      <button
        type="button"
        className="btn btn-success mt-3"
        onClick={() => {
          onClick(trade.id, 1);
        }}
      >
        Accept
      </button>
      {' '}
      <button
        type="button"
        className="btn btn-danger mt-3"
        onClick={() => {
          onClick(trade.id, 2);
        }}
      >
        Reject
      </button>
    </>
  );
}

TradeActionRow.propTypes = {
  trade: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

function TradeBookList({ heading, children }) {
  return (
    <div>
      <h2 className="h4 w-100 mt-2">
        {heading}
      </h2>
      {children}
    </div>
  );
}

TradeBookList.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

function TradeRow({
  trade, isRequester, currentUserBookList, otherUserBookList,
}) {
  return (
    <div key={trade.id} className="mb-3 p-3 border">
      <strong>Created:</strong>
      {' '}
      {new Date(trade.createdAt).toLocaleString('en-US')}
      <br />
      <strong>Status:</strong>
      {' '}
      {StatusEnum[trade.status]}
      <br />
      <strong>Updated:</strong>
      {' '}
      {new Date(trade.updatedAt).toLocaleString('en-US')}
      <br />
      {trade.status === 0 && !isRequester && (
        <TradeActionRow trade={trade} />
      )}
      <div className="d-flex">
        {otherUserBookList}
        {currentUserBookList}
      </div>
    </div>
  );
}

TradeRow.propTypes = {
  trade: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
  }).isRequired,
  isRequester: PropTypes.bool.isRequired,
  currentUserBookList: PropTypes.instanceOf(TradeBookList).isRequired,
  otherUserBookList: PropTypes.instanceOf(TradeBookList).isRequired,
};

function MyRequests() {
  const { data: session } = useSession();
  console.log(session);

  const sessionUserId = session?.user.id;

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
      <TradeRow
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
