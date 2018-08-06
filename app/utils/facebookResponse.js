import axios from 'axios';
import onError from '../utils/onError';

export function processResponse(response) {
  const {
    id, name, email,
  } = response;

  const screenName = email.substring(0, email.indexOf('@'));

  const user = {
    id,
    name,
    email,
    screenName,
  };

  return axios.post('/auth/facebook', user);
}

export function handleError(error) {
  onError(error);
}
