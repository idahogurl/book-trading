import { memo } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Spinner({ size }) {
  return (
    <FontAwesomeIcon icon={faSpinner} className="mt-2" size={`${size}x`} spin />
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
};

Spinner.defaultProps = {
  size: 1,
};

export default memo(Spinner);
