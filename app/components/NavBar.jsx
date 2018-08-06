import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
// Available books has request trade

import { processResponse } from '../utils/facebookResponse';

const initializeUser = function initializeUser() {
  if ('currentUser' in sessionStorage) {
    return sessionStorage.getItem('currentUser');
  }
  return null;
};

class NavBar extends Component {
  state = {
    userId: initializeUser(),
  }

  onLogin = this.onLogin.bind(this)
  onLogout = this.onLogout.bind(this)

  async onLogin(response) {
    const { id: userId } = response;
    sessionStorage.setItem('currentUser', userId);

    await processResponse(response);
    this.setState({ userId });
  }

  onLogout() {
    sessionStorage.clear();
    this.setState({ userId: null });
  }

  render() {
    const { userId } = this.state;
    return (
      <header className="navbar">
        <NavLink to="/books/owned">My Books</NavLink>
        <NavLink to="/books/add">Add Books</NavLink>
        <NavLink to="/books/available">Available Books</NavLink>
        <NavLink to="/books/requests">My Requests</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {userId === null ?
          <LoginButton onLogin={this.onLogin} /> : <LogoutButton onLogout={this.onLogout} /> }
      </header>
    );
  }
}

export default NavBar;
// Use same BookList component but routes are filters
// Create My Books Row
// Create AvailableBooks Row
// Create RequestedBooks Row
// Have Add Book button in My Books

