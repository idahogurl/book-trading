import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import BookRow from './BookRow';

class TradeBookRow extends PureComponent {
  render() {
    const { book, selected, onClick } = this.props;
    // save or remove
    const button = (
      <button
        id={book.id}
        className={cs('btn ml-3', { 'btn-danger': selected }, { 'btn-primary': !selected })}
        title={selected ? 'Remove' : 'Add'}
        onClick={() => { onClick({ id: book.id, userId: book.user.id }); }}
      >
        <i className={cs('fa', { 'fa-close': selected }, { 'fa-plus': !selected })} aria-hidden="true" />
      </button>);

    return (
      <div><BookRow book={book} button={button} /></div>
    );
  }
}

TradeBookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TradeBookRow;
