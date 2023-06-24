import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning, faClose } from '@fortawesome/free-solid-svg-icons';

const darkRed = '#a92019';
const lightRed = '#f0a29d';

const dismissButtonStyle = {
  background: 'transparent',
  border: 'none',
  padding: '0',
  height: '2em',
  color: darkRed,
};

function ErrorNotification({ message, onDismiss }) {
  return (
    <div className="card mb-3 mt-3" style={{ width: '100%', backgroundColor: lightRed }}>
      <div className="card-body">
        <div className="card-text d-flex align-items-center" style={{ color: darkRed }}>
          <div style={{ width: '3em' }}><FontAwesomeIcon icon={faWarning} size="2x" color={darkRed} /></div>
          <div className="w-100">{message || 'An unexpected error occurred. Contact support if this issue continues.'}</div>
          {onDismiss && (
          <button
            type="button"
            onClick={() => {
              onDismiss();
            }}
            aria-label="Close"
            style={dismissButtonStyle}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
          )}
        </div>
      </div>
    </div>
  );
}

ErrorNotification.propTypes = {
  message: PropTypes.string,
  onDismiss: PropTypes.func,
};

ErrorNotification.defaultProps = {
  message: undefined,
  onDismiss: undefined,
};

export default ErrorNotification;
