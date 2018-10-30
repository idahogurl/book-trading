import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import FacebookButton from './FacebookButton';

import processResponse from '../utils/facebookResponse';

const onLogin = async function onLogin(response) {
  const { id } = response;
  sessionStorage.setItem('currentUser', id.toString());

  await processResponse(response);
  window.location.reload();
};

const LoginButton = function LoginButton() {
  return (
    <FacebookLogin
      appId="323585701513857"
      callback={onLogin}
      fields="name,email"
      render={({ isWorking, isLoading, onClick }) => (
        <FacebookButton onClick={onClick}>
          {isLoading || isWorking ? 'Loading ...' : 'Log In'}
        </FacebookButton>
      )}
    />
  );
};

export default LoginButton;
