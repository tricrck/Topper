import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Dropdown, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/user_actions';
import Profile from '../pages/Profile';

const AdminHeader = () => {
  const [notifications] = useState([
    { id: 1, text: 'Build New Features Dipshit', time: '5m ago' },
  ]);
  const [showModal, setShowModal] = useState(false);
  // const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
      dispatch(logout());
      setShowModal(false);
    };

  return (
    <header>
    <Navbar bg="dark" variant="dark" expand="lg" className="py-2 shadow-sm">
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand href="/admin/" className="d-flex align-items-center">
          <i className="bi bi-gear-fill me-2"></i>
          <span className="fw-bold">Admin Panel</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar" />
        <Navbar.Collapse id="admin-navbar">
          {/* Main Navigation */}
          <Nav className="me-auto">
            <Nav.Link href="/admin/bloglist" className="d-flex align-items-center">
              <i className="bi bi-file-text me-1"></i>
              Blogs
            </Nav.Link>
            <Nav.Link href="/admin/portfoliolist" className="d-flex align-items-center">
              <i className="bi bi-collection me-1"></i>
              Portfolios
            </Nav.Link>
            <Nav.Link href="/admin/testimonialist" className="d-flex align-items-center">
              <i className="bi bi-chat-quote me-1"></i>
              Testimonials
            </Nav.Link>
          </Nav>

          {/* Right-side items */}
          <Nav>
            {/* Notifications Dropdown */}
            <Dropdown align="end" className="me-3">
              <Dropdown.Toggle variant="link" className="nav-link text-light position-relative">
                <i className="bi bi-bell"></i>
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill">
                  {notifications.length}
                </Badge>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-dark">
                <Dropdown.Header>Notifications</Dropdown.Header>
                {notifications.map(notification => (
                  <Dropdown.Item key={notification.id} className="py-2">
                    <div className="d-flex flex-column">
                      <span>{notification.text}</span>
                      <small className="text-muted">{notification.time}</small>
                    </div>
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item className="text-center">View All</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="nav-link text-light d-flex align-items-center">
                <i className="bi bi-person-circle me-2"></i>
                <span>Admin</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-dark">
                <Dropdown.Item onClick={() => setShowModal(true)} 
                      className="cursor-pointer"
                      style={{ cursor: 'pointer' }}>
                  <i className="bi bi-person me-2"></i>My Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/logout">
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Modal show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>
        Profile
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Profile onLogout={handleLogout} />
    </Modal.Body>
    </Modal>
    </header>
  );
};

export default AdminHeader;