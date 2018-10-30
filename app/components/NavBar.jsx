import React from 'react';
import NavBarLink from '../components/NavBarLink';

const NavBar = function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar-content"
        aria-controls="navbar-content"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbar-content">
        <ul className="navbar-nav mr-auto">
          <NavBarLink to="/books/owned">My Books</NavBarLink>
          <NavBarLink to="/books/add">Add Books</NavBarLink>
          <NavBarLink to="/books/available">Available Books</NavBarLink>
          <NavBarLink to="/requests/my">My Requests</NavBarLink>
          <NavBarLink to="/requests/new">Create Request</NavBarLink>
          {'currentUser' in sessionStorage && <NavBarLink to="/profile">Profile</NavBarLink>}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
