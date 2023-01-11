import { Component } from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.error({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    // Check if the error is thrown
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <NavBar />
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      );
    }

    // Return children components in case of no error

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ErrorBoundary;
