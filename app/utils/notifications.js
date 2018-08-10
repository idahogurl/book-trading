import AWN from 'awesome-notifications';

const options = {
  position: 'top-right',
};

const notifier = new AWN(options);

export const onError = function onError(err) {
  notifier.alert('An unexpected error occurred. Contact support if this issue continues.');
  console.error(err);
};

export const notify = function notify(message) {
  notifier.info(message);
};
