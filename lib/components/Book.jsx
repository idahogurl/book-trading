/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

import SharedPropTypes from '../propTypes';

import Card from './Card';

const Book = function Book(props) {
  const { book, button, sessionUserId } = props;

  const header = (
    <div className="card-img-top">
      <img src={book.imageUrl} className="mt-2" alt="" width={111} height={148} />
    </div>
  );

  const text = (
    <>
      <strong>Publication Year:</strong>
      {' '}
      {!!book.publicationYear === false ? 'Unavailable' : book.publicationYear}
      <br />
      {book.user && book.user.id !== sessionUserId && (
        <small className="text-muted">
          from
          {' '}
          {book.user.name}
          &nbsp;in
          {' '}
          {book.user.location ? book.user.location : 'Unknown'}
        </small>
      )}
      <div className="mt-3">
        <Link href={`http://books.google.com/books?id=${book.bookId}&hl=&source=gbs_api`} target="_blank">
          <Image src="/images/gbs_preview_button1.png" alt="Preview Book" width={81} height={31} />
        </Link>
      </div>
    </>
  );

  const footer = button && <div className="card-footer" style={{ minHeight: '53px' }}>{button}</div>;

  return (
    <Card
      header={header}
      title={book.title}
      text={text}
      footer={footer}
      style={{ width: '18em' }}
    />
  );
};

Book.propTypes = {
  book: SharedPropTypes.book.isRequired,
  button: PropTypes.element,
  sessionUserId: PropTypes.string,
};

Book.defaultProps = {
  button: null,
  sessionUserId: undefined,
};

export default Book;
