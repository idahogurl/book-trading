import { useSession } from 'next-auth/react';
import { Formik } from 'formik';
import { useLazyQuery } from '@apollo/client';

import GET_GOODREADS_BOOKS from '../../lib/graphql/GetGoodreadsBooks.gql';

import Layout from '../../lib/components/Layout';
import Spinner from '../../lib/components/Spinner';
import ErrorNotification from '../../lib/components/ErrorNotification';
import BookList from '../../lib/components/BookList';
import AddBookRow from '../../lib/components/AddBookRow';
import Card from '../../lib/components/Card';

const fields = [
  { id: 'title', name: 'Title' },
  { id: 'author', name: 'Author' },
  { id: 'all', name: 'ISBN' },
];

function getResultsText(data) {
  if (!data) return null;

  if (data.goodreads[0]) return null;

  return 'No books found';
}

function AddBooksForm({ sessionUserId }) {
  const [getGoodReadsBooks, { error, data }] = useLazyQuery(GET_GOODREADS_BOOKS, {
    fetchPolicy: 'no-cache',
  });

  // should probably do paging
  const noResultsText = getResultsText(data);

  return (
    <div>
      <Formik
        initialValues={{
          q: 'Five Kingdoms',
          field: 'title',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await getGoodReadsBooks({
              variables: { ...values, userId: sessionUserId },
            });
            setSubmitting(false);
          } catch (err) {
            // Show a toast somehow
            // onError(err);
            setSubmitting(false);
          }
        }}
        validate={(values) => {
          const errors = {};

          if (!values.q) {
            errors.q = 'Required';
          }

          return errors;
        }}
      >
        {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
          <div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="q"
                className="form-control d-inline-block w-75"
                onChange={handleChange}
                value={values.q}
              />{' '}
              {errors.trade && <div className="text-danger">{errors.trade}</div>}
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Find
              </button>
              <div>
                {fields.map((field) => (
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
            {error ? <ErrorNotification /> : null}
            {isSubmitting ? (
              <Spinner />
            ) : (
              <div className="d-flex flex-wrap">
                <BookList
                  books={data?.goodreads || []}
                  noResultsText={noResultsText}
                  render={({ book }) => (
                    <AddBookRow key={book.id} sessionUserId={sessionUserId} book={book} />
                  )}
                  sessionUserId={sessionUserId}
                />
              </div>
            )}
          </div>
        )}
      </Formik>
    </div>
  );
}

function AddBooks() {
  const { data: session } = useSession();
  const sessionUserId = session?.user.id;

  return (
    <Layout>
      <h1 className="mt-3 mb-3">Add Books to Owned</h1>
      {sessionUserId ? (
        <AddBooksForm sessionUserId={sessionUserId} />
      ) : (
        <Card text="Log in to view books" />
      )}
    </Layout>
  );
}

export default AddBooks;
