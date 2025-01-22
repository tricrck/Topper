import React, { useState } from 'react';
import { Container, Navbar, Nav, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react';
import Login from '../pages/Login';  // Import your existing Login component
import { Link } from 'react-router-dom'
import { logout } from '../actions/user_actions';
import Profile from '../pages/Profile'

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const modalLoginProps = {
    containerClassName: "", // Remove full-height container
    cardClassName: "", // Remove shadow since modal has its own
    titleSize: "h3", // Smaller title for modal
    titleFont: "fw-semibold", // Slightly less bold
    cardWidth: { xs: 12 }, // Take full width of modal
    cardPadding: "p-4", // Slightly less padding
    isModal: true // Flag to indicate modal context
  };

  const handleLogout = () => {
    dispatch(logout()); // Adjust according to your logout action
    setShowModal(false);
  };

  return (
    <header>
      <Container className="py-4">
        <div className="d-flex align-items-center justify-content-between profile-header">
          <div className="d-flex align-items-center">
            <img
              src="https://raw.githubusercontent.com/tricrck/Topper/refs/heads/main/public/images/self.png"
              alt="Patrick C."
              className="profile-pic rounded-circle"
              style={{ width: '100px', height: '100px', marginRight: '20px' }}
            />
            <div className="profile-info text-black">
              <h1>Patrick C.</h1>
              <p>Software Developer | Based in Kericho, Kenya</p>
            </div>
          </div>
          
          {/* User Icon/Profile Picture */}
          <div 
            onClick={() => setShowModal(true)} 
            className="cursor-pointer"
            style={{ cursor: 'pointer' }}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="rounded-circle"
                style={{ width: '40px', height: '40px' }}
              />
            ) : (
              <User size={24} />
            )}
          </div>
        </div>
      </Container>

      <Navbar variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Dev</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
               <Nav.Item>
                <Link to="/" className="nav-link">Home</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/portfolios" className="nav-link">Portfolio</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/contact" className="nav-link">Contact</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/blogs" className="nav-link">Blog</Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Authentication/Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {user ? 'Profile' : 'Login'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user ? (
            <Profile onLogout={handleLogout} />
          ) : (
              <Login {...modalLoginProps} />
          )}
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;