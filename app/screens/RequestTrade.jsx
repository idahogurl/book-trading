import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import RouterPropsTypes from 'react-router-prop-types';
import { Query, graphql } from 'react-apollo';

import GET_BOOKS from '../graphql/GetBooks.gql';
import CREATE_TRADE from '../graphql/CreateTrade.gql';

import { onError } from '../utils/notifications';

import Spinner from '../components/Spinner';
import BookList from '../components/BookList';
import TradeBookRow from '../components/TradeBookRow';

const userId = 'currentUser' in sessionStorage ? sessionStorage.getItem('currentUser') : null;

class RequestTrade extends Component {
  state = {
    books: [],
  };

  // invalidate all pending trades containing these books when accepted

  onCreateTrade = this.onCreateTrade.bind(this);

  async onCreateTrade() {
    // Do both sides have selections? (check for books not owned by current user)
    const { books } = this.state;
    const otherUser = books.filter((b) => b.bookUserId !== userId);

    if (books.length && otherUser.length) {
      // Are the selections from the same user?
      const firstId = otherUser[0].userId;
      if (otherUser.every((o) => o.userId === firstId)) {
        const { createTrade, history } = this.props;
        await createTrade({ variables: { bookIds: books.map((b) => b.id), userId } });
        history.push('/requests/my');
      } else {
        onError('Choose selections from only one user', false);
      }
    } else {
      onError('You need to made selections from both sides', false);
    }
  }

  onClick = this.onClick.bind(this);

  onClick({ id, userId: bookUserId }) {
    const { books } = this.state;
    const book = books.find((b) => b.id === id);
    if (book) {
      this.setState({ books: books.filter((b) => b.id !== id) });
    } else {
      books.push({ id, bookUserId });
      this.setState({ books });
    }
  }

  render() {
    const { books } = this.state;

    return (
      <Query
        query={GET_BOOKS}
        variables={{ where: JSON.stringify({ available: true }) }}
        fetchPolicy="network-only"
      >
        {({ data, loading, error }) => {
          if (error) {
            onError(error);
            return null;
          }

          if (loading) return <Spinner />;

          const myBooks = data.ownedBooks.filter((o) => o.user.id === userId);
          const availableBooks = data.ownedBooks.filter((o) => o.user.id !== userId);

          return (
            <>
              <h1>Create Trade</h1>
              <div>
                <div className="d-flex flex-wrap">
                  <div className="mr-4">
                    <h2 className="h3 mt-4">My Books</h2>
                    <BookList
                      books={myBooks}
                      render={({ book }) => (
                        <TradeBookRow
                          key={book.id}
                          book={book}
                          onClick={this.onClick}
                          selected={books.findIndex((b) => b.id === book.id) !== -1}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <h2 className="h3 mt-4">Available Books</h2>
                    <BookList
                      books={availableBooks}
                      render={({ book }) => (
                        <TradeBookRow
                          key={book.id}
                          book={book}
                          onClick={this.onClick}
                          selected={books.findIndex((b) => b.id === book.id) !== -1}
                        />
                      )}
                    />
                  </div>
                </div>
                <div style={{ width: '38em' }}>
                  <button
                    type="button"
                    className="btn btn-primary mt-4 mb-4 d-block"
                    onClick={this.onCreateTrade}
                  >
                    Request Trade
                  </button>
                </div>
              </div>
            </>
          );
        }}
      </Query>
    );
  }
}
RequestTrade.propTypes = {
  createTrade: PropTypes.func.isRequired,
  history: RouterPropsTypes.history.isRequired,
};

export default graphql(CREATE_TRADE, { name: 'createTrade' })(RequestTrade);
