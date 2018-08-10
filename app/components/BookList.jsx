import React from 'react';
import PropTypes from 'prop-types';
import { FelaComponent } from 'react-fela';
// Show No Results Found

const style = {
  backgroundColor: 'Gainsboro',
  padding: '10px',
  height: '100%',
  color: 'dimgray',
  textAlign: 'center',
};
const BookList = function BookList(props) {
  return (
    <FelaComponent
      style={style}
      render={({ className }) => (
        <div className={className}>
          {props.books.length !== 0 || 'currentUser' in sessionStorage ?
            <ul className="list-group">
              {props.books.map(b => props.render({ book: b }))}
            </ul>
            : 'Log in to view your books'
          }
        </div>)
  } />);
};

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  render: PropTypes.func.isRequired,
};

export default BookList;
