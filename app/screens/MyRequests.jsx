// Reject or Accept
// Accepted trades voids pending trades containing these books
// Once trade is accepted books are marked as unavailable
// show all trades, have a filter for pending, accepted, and rejected

import React, { Fragment } from 'react';
import { Query } from 'react-apollo';

import { onError } from '../utils/notifications';
import StatusEnum from '../utils/statusEnum';

import GET_REQUESTS from '../graphql/GetRequests.gql';

import BookList from '../components/BookList';
import BookRow from '../components/BookRow';

const MyRequests = function MyRequests() {
  return (
    <div>
      <h1>My Requests</h1>
      <Query query={GET_REQUESTS} variables={{}} fetchPolicy="network-only">
        {({ data, loading, error }) => {
          if (error) onError(error);
          if (loading) return <i className="fa fa-2x fa-spinner fa-spin" />;
          const { trades } = data;
          const userId = sessionStorage.getItem('currentUser');

          const button = (
            <div className="ml-3">
              <button className="btn btn-success mb-3">Accept</button><br />
              <button className="btn btn-danger">Reject</button>
            </div>);


          return trades.map((t) => {
          const books = t.tradeBooks.map(trade => (trade.ownedBook));

          const currentUserBooks = books.filter(b => b.user.id === userId);
          const otherUserBooks = books.filter(b => b.user.id !== userId);
          const isRequester = t.userId === userId;
          const requesterName = isRequester ? 'I' : otherUserBooks[0].user.screenName;
          return (
            <Fragment>
              <strong>Created:</strong> {t.createdAt}<br />
              <strong>Status:</strong> {StatusEnum[t.status]}
              <div className="d-flex">
                <div>
                  {requesterName} {isRequester ? 'want' : 'wants'}:
                  <BookList
                    books={isRequester ? otherUserBooks : currentUserBooks}
                    render={({ book }) =>
                  (<BookRow key={book.id} book={book} showOwner={false} />)}
                  />
                </div>
                <div>
                  {requesterName} will give:
                  <BookList
                    books={isRequester ? currentUserBooks : otherUserBooks}
                    render={({ book }) =>
                  (<BookRow key={book.id} book={book} button={button} showOwner={false} />)}
                  />
                </div>
              </div>
            </Fragment>
            );
        });
      }}
      </Query>
    </div>
  );
};

export default MyRequests;
