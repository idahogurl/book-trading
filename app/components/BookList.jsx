import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import CREATE_MUTATION from '../graphql/CreateOwnedBook.gql';

import BookRow from '../components/BookRow';

// Show No Results Found

const BookList = props => (
  <Mutation mutation={CREATE_MUTATION}>{createMutation => (
    <ul className="list-group w-75 mr-auto ml-auto">
      {props.books.map(b => <BookRow key={b.id} book={b} createMutation={createMutation} />)}
    </ul>
  )}
  </Mutation>
);

// view the books I own

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default BookList;
