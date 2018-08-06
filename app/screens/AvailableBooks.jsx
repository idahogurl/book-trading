import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import GET_BOOKS from '../graphql/GetBooks.gql';
import BookList from '../components/BookList';

const AvailableBooks = function AvailableBooks() {
  const buttonContent = <span>Requests <span className="badge badge-light">2</span></span>

  return (
    <div>
      <h1>Available Books</h1>
      <Link to="/books/add" className="btn btn-primary">Add Book</Link>
      <Query query={GET_BOOKS} variables={{ where: JSON.stringify({ available: true }) }}>
        {({ data, loading, error }) => {
        if (loading) return <i className="fa fa-2x fa-spinner fa-spin" />;
        return <BookList books={data.ownedBooks} buttonContent={buttonContent} onClick={} />;
        }
      }
      </Query>
    </div>
  );
};

export default AvailableBooks;

// show # of trade requests
