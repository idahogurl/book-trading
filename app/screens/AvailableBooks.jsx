import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import GET_BOOKS from '../graphql/GetBooks.gql';
import BookList from '../components/BookList';

import { onError } from '../utils/notifications';

import AvailableBookRow from '../components/AvailableBookRow';

const AvailableBooks = function AvailableBooks() {
  return (
    <div>
      <h1>Available Books</h1>
      <Link to="/books/add" className="btn btn-primary mb-3">Add Book</Link>
      <Query query={GET_BOOKS} variables={{ where: JSON.stringify({ available: true }) }} fetchPolicy="network-only">
        {({ data, loading, error }) => {
          if (error) onError(error);
          if (loading) return <i className="fa fa-2x fa-spinner fa-spin" />;

          return (<BookList
            books={data.ownedBooks}
            render={({ book }) =>
              (<AvailableBookRow key={book.id} book={book} />)}
          />);
        }
      }
      </Query>
    </div>
  );
};

export default AvailableBooks;

// show # of trade requests
