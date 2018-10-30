import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';

function NavBarLink(props) {
  const { to, children } = props;
  const currentPage = window.location.pathname;

  return (
    <div className={cn('nav-item', { active: currentPage === to })}>
      <Link to={to} className="nav-link pl-2">
        {children}
      </Link>
    </div>
  );
}

NavBarLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default NavBarLink;
