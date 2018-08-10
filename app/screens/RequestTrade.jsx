import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { differenceBy } from 'lodash';

import GET_BOOKS from '../graphql/GetBooks.gql';

import { notify, onError } from '../utils/notifications';

import BookList from '../components/BookList';
import TradeBookRow from '../components/TradeBookRow';

class RequestTrade extends Component {
  state = {
    books: [],
    userId: 'currentUser' in sessionStorage ? sessionStorage.getItem('currentUser') : null,
  }

  // invalid all pending trades containing these books when accepted

  onCreateTrade = this.onCreateTrade.bind(this)
  onCreateTrade() {
    // Do both sides have selections? (check for books not owned by current user)
    const { userId, books } = this.state;
    const otherUser = books.filter(b => b.userId !== userId);

    if (books.length && otherUser.length) {
      // Are the selections from the same user?
      const firstId = otherUser[0].userId;
      otherUser.every(o => o.userId === firstId);
      if (otherUser.every(o => o.userId === firstId)) {
        // go
      } else {
        notify('Choose selections from only one user');
      }
    } else {
      notify('You need to made selections from both sides');
    }
  }

  onClick = this.onClick.bind(this)
  onClick({ id, userId }) {
    const { books } = this.state;
    const book = books.find(b => b.id === id);
    if (book) {
      this.setState({ books: books.filter(b => b.id !== id) });
    } else {
      books.push({ id, userId });
      console.log(books);
      this.setState({ books });
    }
  }

  render() {
    const { userId, books } = this.state;
    return (
      <Query query={GET_BOOKS} variables={{ where: JSON.stringify({ available: true }) }} fetchPolicy="network-only">
        {({ data: dataOne, loading: loadingOne, error: errorOne }) => {
          if (errorOne) {
            onError(errorOne);
            return null;
          }

           return (
             <Query query={GET_BOOKS} variables={{ where: JSON.stringify({ userId }) }} fetchPolicy="network-only">
               {({ data: dataTwo, loading: loadingTwo, error: errorTwo }) => {
              if (errorTwo) {
                onError(errorTwo);
                return null;
              }

              if (loadingOne || loadingTwo) return <i className="fa fa-2x fa-spinner fa-spin" />;

              // Remove my books from available
              const availableBooks = differenceBy(dataOne.ownedBooks, dataTwo.ownedBooks, 'id');

              return (
                <Fragment>
                  <h1>Create Trade</h1>
                  <div className="d-flex">
                    <div style={{ width: '43%' }}>
                      <h2 className="h3">Available Books</h2>
                      <BookList
                        books={availableBooks}
                        render={({ book }) =>
                        (<TradeBookRow
                          key={book.id}
                          book={book}
                          onClick={this.onClick}
                          selected={books.findIndex(b => b.id === book.id) !== -1}
                        />)}
                      />
                    </div>
                    <div className="ml-5 mr-5 align-self-center">
                      <button className="btn btn-primary" onClick={this.onCreateTrade}>Request Trade</button>
                    </div>
                    <div style={{ width: '43%' }}>
                      <h2 className="h3">My Books</h2>
                      <BookList
                        books={dataTwo.ownedBooks}
                        render={({ book }) =>
                        (<TradeBookRow
                          key={book.id}
                          book={book}
                          onClick={this.onClick}
                          selected={books.findIndex(b => b.id === book.id) !== -1}
                        />)}
                      />
                    </div>
                  </div>
                </Fragment>);
                }}
             </Query>);
          }}
      </Query>
    );
  }
}
RequestTrade.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({}),
  }).isRequired,
};

export default RequestTrade;
