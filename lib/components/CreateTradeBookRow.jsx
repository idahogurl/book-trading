import PropTypes from 'prop-types';
import cs from 'classnames';

import SharedPropTypes from '../propTypes';
import Book from './Book';

function CreateTradeBookRow({ book, onClick, selected }) {
  // save or remove
  const button = (
    <button
      type="button"
      id={book.id}
      className={cs('btn ml-3', { 'btn-danger': selected }, { 'btn-primary': !selected })}
      title={selected ? 'Remove' : 'Add'}
      onClick={() => {
        onClick({ id: book.id, userId: book.user.id });
      }}
    >
      <i className={cs('fa', { 'fa-close': selected }, { 'fa-plus': !selected })} aria-hidden="true" />
      {selected ? ' Remove' : ' Add'}
    </button>
  );

  return <Book book={book} button={button} />;
}

CreateTradeBookRow.propTypes = {
  book: SharedPropTypes.book.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CreateTradeBookRow;
