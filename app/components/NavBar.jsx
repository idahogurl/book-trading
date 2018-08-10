import React from 'react';
import { NavLink } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

import processResponse from '../utils/facebookResponse';

const onLogin = async function onLogin(response) {
  const { id: userId } = response;
  sessionStorage.setItem('currentUser', userId);

  await processResponse(response);
  window.location.reload();
};

const onLogout = function onLogout() {
  sessionStorage.clear();
  window.location.reload();
};

const NavBar = function NavBar() {
  return (
    <header className="navbar">
      <NavLink to="/books/owned">My Books</NavLink>
      <NavLink to="/books/add">Add Books</NavLink>
      <NavLink to="/books/available">Available Books</NavLink>
      <NavLink to="/requests">My Requests</NavLink>
      <NavLink to="/requests/new">Create Request</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      {'currentUser' in sessionStorage === false ?
        <LoginButton onLogin={onLogin} /> : <LogoutButton onLogout={onLogout} /> }
    </header>
  );
};

export default NavBar;

