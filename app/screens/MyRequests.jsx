// Reject or Accept
// Accepted trades voids pending trades containing these books

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, graphql } from 'react-apollo';

import { onError } from '../utils/notifications';
import StatusEnum from '../utils/statusEnum';

import GET_REQUESTS from '../graphql/GetRequests.gql';
import UPDATE_TRADE from '../graphql/UpdateTrade.gql';

import BookList from '../components/BookList';
import Book from '../components/Book';

class MyRequests extends PureComponent {
  onClick = this.onClick.bind(this)
  onClick(id, status) {
    const { updateTrade } = this.props;
    updateTrade({ variables: { id, status } });
  }

  render() {
    if (!('currentUser' in sessionStorage)) {
      return (
        <div className="card">
          <div className="card-body">
            <div className="card-text">Log in to view your requests</div>
          </div>
        </div>);
    }

    return (
      <Fragment>
        <h1>My Requests</h1>
        <Query query={GET_REQUESTS} variables={{}} fetchPolicy="network-only">
          {({ data, loading, error }) => {
          if (error) onError(error);
          if (loading) return <i className="fa fa-2x fa-spinner fa-spin" />;
          const { trades } = data;
          const userId = sessionStorage.getItem('currentUser');

          return trades.map((t) => {
            const books = t.tradeBooks.map(trade => (trade.ownedBook));

            const currentUserBooks = books.filter(b => b.user.id === userId);
            const otherUserBooks = books.filter(b => b.user.id !== userId);
            const isRequester = t.userId === userId;
            const requesterName = isRequester ? 'I' : otherUserBooks[0].user.screenName;
            return (
              <div key={t.id} className="mb-3 p-3 border">
                <strong>Created:</strong> {new Date(t.createdAt).toLocaleString('en-US')}<br />
                <strong>Status:</strong> {StatusEnum[t.status]}<br />
                <strong>Updated:</strong> {new Date(t.updatedAt).toLocaleString('en-US')}<br />

                {t.status === 0 && !isRequester &&
                  <Fragment>
                    <button className="btn btn-success mt-3" onClick={() => { this.onClick(t.id, 1); }}>Accept</button>
                    {' '}
                    <button className="btn btn-danger mt-3" onClick={() => { this.onClick(t.id, 2); }}>Reject</button>
                  </Fragment>
                }
                <div className="d-flex">
                  <div>
                    <h2 className="h4 w-100 mt-2">{`${requesterName} ${isRequester ? 'want' : 'wants'}`}</h2>
                    <BookList
                      books={isRequester ? otherUserBooks : currentUserBooks}
                      render={({ book }) =>
                          (<Book
                            key={book.id}
                            book={book}
                          />)}
                    />
                  </div>
                  <div>
                    <h2 className="h4 w-100 mt-2">{`${requesterName} will give`}</h2>
                    <BookList
                      books={isRequester ? currentUserBooks : otherUserBooks}
                      render={({ book }) =>
                      (<Book key={book.id} book={book} />)}
                    />
                  </div>
                </div>
              </div>
              );
          });
        }}
        </Query>
      </Fragment>
    );
  }
}

MyRequests.propTypes = {
  updateTrade: PropTypes.func.isRequired,
};

export default graphql(UPDATE_TRADE, { name: 'updateTrade' })(MyRequests);
