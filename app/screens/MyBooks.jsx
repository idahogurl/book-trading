// Indicate part of pending trade?
// Link to trade. Just use My Trades and filter by id?

import React, { Fragment, PureComponent } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import RouterPropTypes from 'react-router-prop-types';

import GET_BOOKS from '../graphql/GetBooks.gql';
import DELETE_MUTATION from '../graphql/DeleteOwnedBook.gql';

import Spinner from '../components/Spinner';
import BookList from '../components/BookList';
import MyBookRow from '../components/MyBookRow';

import { onError } from '../utils/notifications';

const userId = 'currentUser' in sessionStorage ? sessionStorage.getItem('currentUser') : null;

class MyBooks extends PureComponent {
  onDeleteClick = this.onDeleteClick.bind(this);
  onDeleteClick() {
    const { history } = this.props;
    history.go(0);
  }
  render() {
    return (
      <Fragment>
        <h1>My Books</h1>
        <Link to="/books/add" className="btn btn-primary mb-3">
          Add Book
        </Link>
        <Mutation mutation={DELETE_MUTATION}>
          {deleteMutation => (
            <Query
              query={GET_BOOKS}
              variables={{ where: JSON.stringify({ userId, available: true }) }}
              fetchPolicy="network-only"
            >
              {({ data, loading, error }) => {
                if (error) onError(error);
                if (loading) return <Spinner />;

                return (
                  <BookList
                    books={data.ownedBooks}
                    render={({ book }) => (
                      <MyBookRow
                        key={book.id}
                        book={book}
                        deleteMutation={deleteMutation}
                        onDeleteClick={this.onDeleteClick}
                      />
                    )}
                  />
                );
              }}
            </Query>
          )}
        </Mutation>
      </Fragment>
    );
  }
}

MyBooks.propTypes = {
  history: RouterPropTypes.history.isRequired,
};

export default MyBooks;

// show # of trade requests
