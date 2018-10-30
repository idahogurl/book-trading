import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { Mutation, ApolloConsumer } from 'react-apollo';

import GET_GOODREADS_BOOKS from '../graphql/GetGoodreadsBooks.gql';
import CREATE_MUTATION from '../graphql/CreateOwnedBook.gql';

import { onError } from '../utils/notifications';

import Spinner from '../components/Spinner';
import BookList from '../components/BookList';
import AddBookRow from '../components/AddBookRow';

const fields = [
  { id: 'title', name: 'Title' },
  { id: 'author', name: 'Author' },
  { id: 'all', name: 'ISBN' },
];

const userId = 'currentUser' in sessionStorage ? sessionStorage.getItem('currentUser') : null;

class AddBooks extends React.Component {
  state = {
    books: null,
  };
  render() {
    const { books } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <Fragment>
            <h1>Add Books to Owned</h1>
            <Formik
              initialValues={{ q: 'Five Kingdoms', field: 'title' }}
              onSubmit={async (values, { setSubmitting }) => {
              try {
                  const { data } = await client.query({
                    query: GET_GOODREADS_BOOKS,
                    variables: { ...values, userId },
                    fetchPolicy: 'no-cache',
                  });
                  setSubmitting(false);
                  this.setState({ books: data.goodreads });
                } catch (err) {
                  setSubmitting(false);
                  onError(err);
                }
              }}
              render={({
                     values, handleChange, handleSubmit, isSubmitting,
                    }) => (
                      <div>
                        <form onSubmit={handleSubmit}>
                          <input
                            type="text"
                            name="q"
                            className="form-control d-inline-block w-75"
                            onChange={handleChange}
                            value={values.q}
                          />{' '}
                          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      Find
                          </button>
                          <div>
                            {fields.map(field => (
                              <div key={field.id} className="form-check form-check-inline">
                                <label className="form-check-label" htmlFor="field">
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
                        {isSubmitting && <Spinner />}
                        <Mutation mutation={CREATE_MUTATION}>
                          {createMutation => (
                            <div className="d-flex flex-wrap">
                              <BookList
                                books={books || []}
                                noResultsText={books === null ? null : 'No Books Found'}
                                render={({ book }) => (
                                  <AddBookRow
                                    key={book.id}
                                    book={book}
                                    createMutation={createMutation}
                                  />
                              )}
                              />
                            </div>
                          )}
                        </Mutation>
                      </div>
                    )}
            />
          </Fragment>
        )}
      </ApolloConsumer>
    );
  }
}

export default AddBooks;
