import React from 'react';
import PropTypes from 'prop-types';

const Book = function Book(props) {
  const { book } = props;
  return (
    <div className="card m-2 text-center" style={{ width: '18em' }}>
      <div className="card-img-top">
        <img src={book.imageUrl} className="mt-2" alt="" />
      </div>
      <div className="card-body">
        <div className="card-title"><strong>{book.title}</strong></div>
        <div className="card-text"><strong>Published:</strong> {book.publicationYear}<br />
          <strong>Author:</strong> {book.author}<br />
          {book.user &&
            <small className="text-muted">from {book.user.screenName}
            &nbsp;in {book.user.location ? book.user.location : 'Unknown'}
            </small>}
        </div>
      </div>
      {props.button &&
        <div className="card-footer">
          {props.button}
        </div>}
    </div>
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
