import React from 'react';
import PropTypes from 'prop-types';
import { FelaComponent } from 'react-fela';
import classNames from 'classnames';

const style = {
  backgroundColor: '#3B5998',
  color: 'white',
};

const FacebookButton = function FacebookButton(props) {
  return (
    <FelaComponent
      style={style}
      render={({ className }) => (
        <button className={classNames('btn', className)} onClick={props.onClick}>
          <img src="images/facebook-app-logo.svg" className="fb-icon align-middle mr-2" alt="" aria-hidden="true" />
          <span className="align-middle">
            {props.children}
          </span>
        </button>
      )
      }
    />);
};

FacebookButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
};

export default FacebookButton;
