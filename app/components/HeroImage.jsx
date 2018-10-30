import React from 'react';
import PropTypes from 'prop-types';
import { FelaComponent } from 'react-fela';

export default function HeroImage(props) {
  const style = {
    backgroundImage: `url("${props.src}")`,
    backgroundSize: 'cover',
    width: '100%',
    height: '300px',
    marginBottom: '1em',
  };
  return <FelaComponent style={style} render={({ className }) => <div className={className} />} />;
}

HeroImage.propTypes = {
  src: PropTypes.string.isRequired,
};
