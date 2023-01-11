import PropTypes from 'prop-types';

export default function HeroImage({ src }) {
  const style = {
    backgroundImage: `url("${src}")`,
    backgroundSize: 'cover',
    width: '100%',
    height: '300px',
    marginBottom: '1em',
  };
  return <div style={style} />;
}

HeroImage.propTypes = {
  src: PropTypes.string.isRequired,
};
