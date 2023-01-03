import PropTypes from 'prop-types';

function Card(props) {
  const {
    header, title, text, footer,
  } = props;
  return (
    <div className="card m-2 text-center" style={{ width: '18em' }}>
      {header || null}
      <div className="card-body">
        {title && (
          <div className="card-title">
            <strong>{title}</strong>
          </div>
        )}
        <div className="card-text">{text}</div>
      </div>
      {footer || null}
    </div>
  );
}

Card.propTypes = {
  text: PropTypes.node.isRequired,
  header: PropTypes.node,
  title: PropTypes.string,
  footer: PropTypes.node,
};

Card.defaultProps = {
  header: null,
  title: null,
  footer: null,
};

export default Card;
