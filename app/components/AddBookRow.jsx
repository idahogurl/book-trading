import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';

import Book from './Book';

const userId = 'currentUser' in sessionStorage ? sessionStorage.getItem('currentUser') : null;

class AddBookRow extends Component {
  constructor() {
    super();
    const { book } = this.props;
    this.state = { book };
  }

  onClick = this.onClick.bind(this);

  async onClick() {
    const { createMutation, book } = this.props;

    if (userId !== null) {
      const {
        id, title, author, imageUrl, publicationYear,
      } = book;

      const input = {
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
      // notify('Login to add books');
      // TODO: Show toast
    }
  }

  render() {
    const { book } = this.state;
    const isLoggedIn = userId !== null;
    const button = (
      <button
        type="button"
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
