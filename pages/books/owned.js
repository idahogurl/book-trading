import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';

import GET_BOOKS from '../../lib/graphql/GetBooks.gql';

import Layout from '../../lib/components/Layout';
import Spinner from '../../lib/components/Spinner';
import ErrorNotification from '../../lib/components/ErrorNotification';
import BookList from '../../lib/components/BookList';
import MyBookRow from '../../lib/components/MyBookRow';

function MyBooks() {
  const { data: session } = useSession();
  const sessionUserId = session?.user.id;

  const {
    loading, data, error, refetch,
  } = useQuery(GET_BOOKS, {
    variables: { where: JSON.stringify({ userId: sessionUserId, available: true }) },
    fetchPolicy: 'network-only',
  });

  // NOTE: Better to use refetch function. 'refreshQueries' is available
  // in the mutation but it causes the query to run twice

  return (
    <Layout>
      <h1>My Books</h1>
      <Link href="/books/add" className="btn btn-primary mb-3">
        Add Book
      </Link>
      {loading && <div><Spinner /></div>}
      {error && <ErrorNotification onDismiss={refetch} />}
      {!loading && (
      <div className="d-flex flex-wrap">
        <BookList
          books={data?.ownedBooks || []}
          sessionUserId={sessionUserId}
          render={({ book }) => (
            <MyBookRow
              key={book.id}
              book={book}
              sessionUserId={sessionUserId}
              refetch={refetch}
            />
          )}
        />
      </div>
      )}
    </Layout>
  );
}

export default MyBooks;
