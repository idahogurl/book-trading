import Link from 'next/link';
import { useQuery } from '@apollo/client';

import GET_BOOKS from '../../lib/graphql/GetBooks.gql';

import Spinner from '../../lib/components/Spinner';
import BookList from '../../lib/components/BookList';
import AvailableBookRow from '../../lib/components/AvailableBookRow';

const AvailableBooks = function AvailableBooks() {
  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: { where: JSON.stringify({ available: true }) },
    fetchPolicy: 'network-only',
  });

  if (error) {
    throw Error(error);
  }

  return (
    <>
      <h1>Available Books</h1>
      {loading && <Spinner />}
      <Link to="/books/add" className="btn btn-primary mb-3">Add Book</Link>
      <div className="d-flex flex-wrap">
        <BookList
          books={data.ownedBooks}
          render={({ book }) => (<AvailableBookRow key={book.id} book={book} />)}
        />
      </div>
    </>
  );
};

export default AvailableBooks;
