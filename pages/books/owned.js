import PropTypes from 'prop-types';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';

import GET_BOOKS from '../../lib/graphql/GetBooks.gql';

import Layout from '../../lib/components/Layout';
import Card from '../../lib/components/Card';
import Spinner from '../../lib/components/Spinner';
import ErrorNotification from '../../lib/components/ErrorNotification';
import BookList from '../../lib/components/BookList';
import MyBookRow from '../../lib/components/MyBookRow';

function MyBooksList({ sessionUserId }) {
  const { loading, data, error, refetch } = useQuery(GET_BOOKS, {
    variables: { where: JSON.stringify({ userId: sessionUserId, available: true }) },
    fetchPolicy: 'network-only',
  });

  // NOTE: Better to use refetch function. 'refreshQueries' is available
  // in the mutation but it causes the query to run twice

  if (loading) return <Spinner />;
  if (error) return <ErrorNotification onDismiss={refetch} />;

  return (
    <div className="d-flex flex-wrap">
      <BookList
        books={data?.ownedBooks || []}
        sessionUserId={sessionUserId}
        render={({ book }) => (
          <MyBookRow key={book.id} book={book} sessionUserId={sessionUserId} refetch={refetch} />
        )}
      />
    </div>
  );
}

MyBooksList.propTypes = {
  sessionUserId: PropTypes.string.isRequired,
};

function MyBooks() {
  const { data: session } = useSession();
  const sessionUserId = session?.user.id;

  return (
    <Layout>
      <h1 className="mt-3 mb-3">My Books</h1>
      <Link href="/books/add" className="btn btn-primary mb-3">
        Add Book
      </Link>
      {sessionUserId ? (
        <MyBooksList sessionUserId={sessionUserId} />
      ) : (
        <Card text="Log in to view your books" />
      )}
    </Layout>
  );
}

export default MyBooks;
