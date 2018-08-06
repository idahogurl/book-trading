import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class BookRow extends PureComponent {
  onClick = this.onClick.bind(this)
  onClick() {
    const { createMutation, book } = this.props;
    const userId = sessionStorage.getItem('currentUser');
    createMutation({ variables: { input: { ...book, userId } } });
  }

  render() {
    const { book } = this.props;
    return (
      <li className="list-group-item d-flex">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex">
            <img src={book.imageUrl} alt="" />
            <div className="ml-2">
              <div><strong>Title:</strong> {book.title}</div>
              <div><strong>Published:</strong> {book.publicationYear}</div>
              <div><strong>Author: {book.author}</strong></div>
              from muisoft in Lagos State, Nigeria.
            </div>
          </div>
          <div className="float-right" />
        </div>
      </li>);
  }
}

BookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
  createMutation: PropTypes.func.isRequired,
};

export default BookRow;
