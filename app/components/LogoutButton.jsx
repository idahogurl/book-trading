import React from 'react';
import FacebookButton from './FacebookButton';

const onLogout = function onLogout() {
  sessionStorage.clear();
  window.location = '/';
};

const LogoutButton = function LogoutButton() {
  return <FacebookButton onClick={onLogout}>Log Out</FacebookButton>;
};

export default LogoutButton;
