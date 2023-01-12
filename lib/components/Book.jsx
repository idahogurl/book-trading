/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';
import SharedPropTypes from '../propTypes';

import Card from './Card';

const Book = function Book(props) {
  const { book, button, sessionUserId } = props;

  const header = (
    <div className="card-img-top">
      <img src={book.imageUrl} className="mt-2" alt="" width="111" height="148" />
    </div>
  );

  const text = (
    <>
      <strong>Publication Year:</strong>
      {' '}
      {book.publicationYear ? 'Unavailable' : null}
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
};

Book.defaultProps = {
  button: null,
};

export default Book;
