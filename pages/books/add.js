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

function AddBooks() {
  const { data: session } = useSession();
  const sessionUserId = session?.user.id;

  const [getGoodReadsBooks, { error, data }] = useLazyQuery(GET_GOODREADS_BOOKS, {
    fetchPolicy: 'no-cache',
  });
  if (!sessionUserId) {
    return <Card text="Log in to view books" />;
  }
  // should probably do paging
  const noResultsText = getResultsText(data);

  return (
    <Layout>
      <h1>Add Books to Owned</h1>
      <Formik
        initialValues={{ q: 'Five Kingdoms', field: 'title' }}
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
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="q"
                className="form-control d-inline-block w-75"
                onChange={handleChange}
                value={values.q}
              />
              {' '}
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
                      />
                      {' '}
                      {field.name}
                    </label>
                  </div>
                ))}
              </div>
            </form>
            {error ? <ErrorNotification /> : null}
            {isSubmitting ? <Spinner />
              : (
                <div className="d-flex flex-wrap">
                  <BookList
                    books={data?.goodreads || []}
                    noResultsText={noResultsText}
                    render={({ book }) => (
                      <AddBookRow
                        key={book.id}
                        sessionUserId={sessionUserId}
                        book={book}
                      />
                    )}
                    sessionUserId={sessionUserId}
                  />
                </div>
              )}
          </div>
        )}
      </Formik>
    </Layout>
  );
}

export default AddBooks;
