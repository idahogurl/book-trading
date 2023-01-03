import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Book from './Book';

class MyBookRow extends PureComponent {
  onClick = this.onClick.bind(this)

  async onClick() {
    const { deleteMutation, book, onDeleteClick } = this.props;
    await deleteMutation({ variables: { id: book.id } });
    onDeleteClick();
  }

  render() {
    const { book } = this.props;
    const button = <button type="button" id={book.id} className="btn btn-danger" onClick={this.onClick}>Delete</button>;

    return <Book book={book} button={button} />;
  }
}

MyBookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
  deleteMutation: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default MyBookRow;
