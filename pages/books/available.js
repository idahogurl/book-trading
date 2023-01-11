import { useSession } from 'next-auth/react';
import Link from 'next/link';

import GET_BOOKS from '../../lib/graphql/GetBooks.gql';

import BookList from '../../lib/components/BookList';
import AvailableBookRow from '../../lib/components/AvailableBookRow';
import Layout from '../../lib/components/Layout';
import client from '../../lib/apolloClient';

const AvailableBooks = function AvailableBooks({ ownedBooks }) {
  const { data: session } = useSession();

  return (
    <Layout>
      <h1>Available Books</h1>
      <Link href="/books/add" className="btn btn-primary mb-3">Add Book</Link>
      <div className="d-flex flex-wrap">
        <BookList
          books={ownedBooks}
          sessionUserId={session?.user.id}
          render={({ book }) => (<AvailableBookRow key={book.id} book={book} />)}
        />
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const { data } = await client.query({
    query: GET_BOOKS,
    variables: { where: JSON.stringify({ available: true }) },
    fetchPolicy: 'network-only',
  });

  return {
    props: {
      ownedBooks: data.ownedBooks,
    },
  };
}

export default AvailableBooks;
