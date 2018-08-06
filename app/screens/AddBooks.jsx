import React from 'react';
import { Formik } from 'formik';
import { Mutation, ApolloConsumer } from 'react-apollo';

import GET_GOODREADS_BOOKS from '../graphql/GetGoodreadsBooks.gql';
import CREATE_MUTATION from '../graphql/CreateOwnedBook.gql';

import BookList from '../components/BookList';
import AddBookRow from '../components/AddBookRow';

const fields = [
  { id: 'title', name: 'Title' },
  { id: 'author', name: 'Author' },
  { id: 'all', name: 'ISBN' },
];

export default class AddBooks extends React.Component {
  state = {
    books: [],
  }
  render() {
    const { books } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <div>
          Add Books to Owned
            <Formik
              initialValues={{ q: 'Five Kingdoms', field: 'title' }}
              onSubmit={async (values) => {
                const { data } = await
                  client.query({ query: GET_GOODREADS_BOOKS, variables: { ...values }, fetchPolicy: 'no-cache' });
                this.setState({ books: data.goodreads });
              }}
              render={({ values, handleChange, handleSubmit }) => (
                <div className="container">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="q"
                      className="form-control d-inline-block w-75"
                      onChange={handleChange}
                      value={values.q}
                    />{' '}
                    <button type="submit" className="btn btn-primary">Find</button>
                    <div>
                      {fields.map(field => (
                        <div
                          key={field.id}
                          className="form-check form-check-inline"
                        >
                          <label className="form-check-label">
                            <input
                              name="field"
                              type="radio"
                              value={field.id}
                              checked={values.field === field.id}
                              onChange={handleChange}
                              className="form-check-input"
                            />{' '}
                            {field.name}
                          </label>
                        </div>
                  ))}
                    </div>
                  </form>
                </div>
          )}
            />
            <Mutation mutation={CREATE_MUTATION}>{createMutation => (
              <BookList
                books={books}
                render={({ book }) =>
                    (<AddBookRow key={book.id} book={book} createMutation={createMutation} />)}
              />)}
            </Mutation>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

