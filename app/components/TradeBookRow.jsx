import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import Book from './Book';

class TradeBookRow extends PureComponent {
  onClick = this.onClick.bind(this);
  onClick() {
    const { book, onClick } = this.props;
    onClick({ id: book.id, userId: book.user.id });
  }
  render() {
    const { book, selected } = this.props;

    // save or remove
    const button = (
      <button
        id={book.id}
        className={cs('btn ml-3', { 'btn-danger': selected }, { 'btn-primary': !selected })}
        title={selected ? 'Remove' : 'Add'}
        onClick={this.onClick}
      >
        <i className={cs('fa', { 'fa-close': selected }, { 'fa-plus': !selected })} aria-hidden="true" />
        {selected ? ' Remove' : ' Add'}
      </button>);

    return <Book book={book} button={button} />;
  }
}

TradeBookRow.propTypes = {
  book: PropTypes.shape({}).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TradeBookRow;
