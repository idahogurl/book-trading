import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar({ session }) {
  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/books/owned">My Books</Nav.Link>
          <Nav.Link href="/books/add">Add Books</Nav.Link>
          <Nav.Link href="/books/available">Available Books</Nav.Link>
          <Nav.Link href="/requests/my">My Requests</Nav.Link>
          <Nav.Link href="/requests/new">Create Request</Nav.Link>
          {session && <Nav.Link href="/profile">Profile</Nav.Link>}
        </Nav>
      </Navbar.Collapse>

    </Navbar>
  );
}

NavBar.propTypes = {
  session: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

NavBar.defaultProps = {
  session: undefined,
};

export default NavBar;
