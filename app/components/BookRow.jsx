import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class BookRow extends PureComponent {
  render() {
    const { book, button } = this.props;
    return (
      <li className="list-group-item d-flex">
        <div className="d-flex justify-content-between w-100">
          <Book book={book} />
          <div className="float-right">
            {button}
          </div>
        </div>
      </li>);
  }
}

BookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
  button: PropTypes.element.isRequired,
};

export default BookRow;
