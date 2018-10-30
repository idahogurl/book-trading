import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import uuid from 'uuid/v4';

import { notify } from '../utils/notifications';
import Book from './Book';

const userId = 'currentUser' in sessionStorage ? sessionStorage.getItem('currentUser') : null;

class AddBookRow extends Component {
  state = {
    book: this.props.book,
  };
  onClick = this.onClick.bind(this);
  async onClick() {
    const { createMutation, book } = this.props;

    if (userId !== null) {
      const {
        id, title, author, imageUrl, publicationYear,
      } = book;

      const input = {
        id: uuid(),
        bookId: id,
        title,
        author,
        imageUrl,
        publicationYear,
        userId,
        available: true,
      };

      const {
        data: { createOwnedBook },
      } = await createMutation({ variables: { input } });

      createOwnedBook.owned = true;
      this.setState({ book: createOwnedBook });
    } else {
      notify('Login to add books');
    }
  }

  render() {
    const { book } = this.state;
    const isLoggedIn = userId !== null;
    const button = (
      <button
        onClick={this.onClick}
        className={cs('btn btn-primary', { disabled: isLoggedIn && book.owned })}
      >
        {isLoggedIn && book.owned ? 'Book is Owned' : 'Add to Owned'}
      </button>
    );
    return <Book book={book} button={button} />;
  }
}

AddBookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
  createMutation: PropTypes.func.isRequired,
};

export default AddBookRow;
