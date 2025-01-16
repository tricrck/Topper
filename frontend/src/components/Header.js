import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <header>
      <Container className="py-4">
        <div className="d-flex align-items-center profile-header">
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
      </Container>
      <Navbar variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Patrick's Portfolio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/portfolios">Portfolio</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
              <Nav.Link href="/blogs">Blog</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;