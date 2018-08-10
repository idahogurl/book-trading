import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';

import { notify } from '../utils/notifications';
import BookRow from './BookRow';

class AddBookRow extends Component {
  state = {
    book: this.props.book,
  }
  onClick = this.onClick.bind(this)
  async onClick() {
    const { createMutation, book } = this.props;
    const userId = sessionStorage.getItem('currentUser');

    if ('currentUser' in sessionStorage) {
      const {
        id, title, author, imageUrl, publicationYear,
      } = book;

      const input = {
        id,
        title,
        author,
        imageUrl,
        publicationYear,
        userId,
        available: true,
      };
      const { data: { createOwnedBook } } = await createMutation({ variables: { input } });
      createOwnedBook.owned = true;
      this.setState({ book: createOwnedBook });
    } else {
      notify('Login to add books');
    }
  }

  render() {
    const { book } = this.state;
    const isLoggedIn = 'currentUser' in sessionStorage;
    const button = (
      <button onClick={this.onClick} className={cs('btn btn-primary', { disabled: isLoggedIn && book.owned })}>
        {isLoggedIn && book.owned ? 'Book is Owned' : 'Add to Owned'}
      </button>);
    return (
      <div><BookRow book={book} button={button} /></div>
    );
  }
}

AddBookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
  createMutation: PropTypes.func.isRequired,
};

export default AddBookRow;
