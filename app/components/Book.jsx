import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const Book = function Book(props) {
  const { book, button } = props;

  const header = (
    <div className="card-img-top">
      <img src={book.imageUrl} className="mt-2" alt="" />
    </div>
  );

  const text = (
    <Fragment>
      <strong>Publication Year:</strong>

      <br />
      {book.user && (
        <small className="text-muted">
          from {book.user.screenName}
          &nbsp;in {book.user.location ? book.user.location : 'Unknown'}
        </small>
      )}
    </Fragment>
  );

  const footer = button && <div className="card-footer">{button}</div>;

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
  book: PropTypes.shape({}).isRequired,
  button: PropTypes.element,
};

Book.defaultProps = {
  button: null,
};

export default Book;
