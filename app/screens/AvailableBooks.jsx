import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import Link from 'next/link';

import GET_BOOKS from '../graphql/GetBooks.gql';

import { onError } from '../utils/notifications';

import Spinner from '../components/Spinner';
import BookList from '../components/BookList';
import AvailableBookRow from '../components/AvailableBookRow';

const AvailableBooks = function AvailableBooks() {
  return (
    <>
      <h1>Available Books</h1>
      <Query query={GET_BOOKS} variables={{ where: JSON.stringify({ available: true }) }} fetchPolicy="network-only">
        {({ data, loading, error }) => {
          if (error) onError(error);
          if (loading) return <Spinner />;

          return (
            <>
              <Link to="/books/add" className="btn btn-primary mb-3">Add Book</Link>
              <div className="d-flex flex-wrap">
                <BookList
                  books={data.ownedBooks}
                  render={({ book }) => (<AvailableBookRow key={book.id} book={book} />)}
                />
              </div>
            </>
          );
        }}
      </Query>
    </>
  );
};

export default AvailableBooks;
