import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

const darkRed = '#a92019';
const lightRed = '#f0a29d';

function ErrorNotification({ message }) {
  return (
    <div className="card mb-3 mt-3" style={{ width: '100%', backgroundColor: lightRed }}>
      <div className="card-body">
        <p className="card-text" style={{ color: darkRed }}>
          <FontAwesomeIcon icon={faWarning} size="2x" color={darkRed} />
          {' '}
          {message || 'An unexpected error occurred. Contact support if this issue continues.'}
        </p>
      </div>
    </div>
  );
}

export default ErrorNotification;
