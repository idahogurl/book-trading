import PropTypes from 'prop-types';

const propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    publicationYear: PropTypes.number,
    requestCount: PropTypes.number,
    user: PropTypes.shape({
      name: PropTypes.string,
      location: PropTypes.string,
    }),
  }),
};

export default propTypes;
