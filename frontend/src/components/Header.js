import React, { useState } from 'react';
import { 
  Container, Navbar, Nav, Modal, 
  Image, Row, Col, Badge 
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, House, BookOpen, Briefcase, 
  MessageSquare, LogIn 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../actions/user_actions';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', name: 'Home', icon: <House size={18} className="me-1" /> },
    { path: '/portfolios', name: 'Work', icon: <Briefcase size={18} className="me-1" /> },
    { path: '/blogs', name: 'Blog', icon: <BookOpen size={18} className="me-1" /> },
    { path: '/contact', name: 'Contact', icon: <MessageSquare size={18} className="me-1" /> }
  ];

  const handleLogout = () => {
    dispatch(logout());
    setShowModal(false);
    navigate('/');
  };

  return (
    <header className="border-bottom">
      {/* Profile Header */}
      <Container className="py-3">
        <Row className="align-items-center g-3">
          <Col xs="auto">
            <Image
              src="https://raw.githubusercontent.com/tricrck/Topper/main/public/images/self.png"
              alt="Patrick C."
              roundedCircle
              className="shadow-sm"
              style={{ width: '80px', height: '80px' }}
            />
          </Col>
          <Col>
            <div className="d-flex flex-column">
              <h1 className="h4 mb-0 fw-bold">Patrick C.</h1>
              <span className="text-muted">Developer</span>
              <Badge bg="light" text="dark" className="mt-1 rounded-pill align-self-start">
                Kericho, Kenya
              </Badge>
            </div>
          </Col>
          <Col xs="auto">
            <div 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center gap-2 cursor-pointer hover-scale"
            >
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  roundedCircle
                  style={{ width: '40px', height: '40px' }}
                />
              ) : (
                <>
                  <User size={24} />
                  <span className="d-none d-lg-inline">{user ? 'Profile' : 'Login'}</span>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Navigation Bar */}
      <Navbar expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="w-100 justify-content-between">
              {navLinks.map((link) => (
                <Nav.Item key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`nav-link d-flex align-items-center ${
                      location.pathname === link.path ? 'active fw-bold' : ''
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </Nav.Item>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

       {/* Updated Auth Modal */}
       <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setAuthMode('login'); // Reset to login when closing
      }} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="h5">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <User size={24} />
                Account Overview
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user ? (
            <Profile onLogout={handleLogout} />
          ) : authMode === 'login' ? (
            <Login 
              isModal
              onSuccess={() => setShowModal(false)}
              switchToSignup={() => setAuthMode('signup')}
              cardPadding="p-0"
            />
          ) : (
            <Signup 
              isModal
              onSuccess={() => setShowModal(false)}
              switchToLogin={() => setAuthMode('login')}
              cardPadding="p-0"
            />
          )}
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;