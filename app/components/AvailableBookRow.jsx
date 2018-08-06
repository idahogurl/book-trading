import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BookRow from './BookRow';

class AddBookRow extends PureComponent {
  onClick = this.onClick.bind(this)
  onClick() {
    const { book } = this.props;
    const userId = sessionStorage.getItem('currentUser');
    // createMutation({ variables: { input: { ...book, userId } } });
  }

  render() {
    const { book } = this.props;
    const button = <span>Requests <span className="badge badge-light">2</span></span>;


    return (
      <div><BookRow book={book} button={button} /></div>
    );
  }
}

AddBookRow.propTypes = {
  book: PropTypes.shape.isRequired,
};

export default AddBookRow;
