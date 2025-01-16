import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="p-4 rounded-3 shadow-lg border-secondary">
            <h2 className="text-center mb-4">
              <i className="bi bi-moon-stars me-2"></i>
              Contact Us
            </h2>
            
            <Form 
              action="https://formsubmit.co/tricrck@gmail.com" 
              method="POST"
              className="text-light"
            >
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="border-secondary"
                  placeholder="Enter your name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border-secondary"
                  placeholder="Enter your email"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="border-secondary"
                  rows={4}
                  placeholder="Your message here..."
                />
              </Form.Group>

              <div className="text-center">
                <Button 
                  variant="outline-light" 
                  type="submit"
                  className="px-4 py-2"
                >
                  <i className="bi bi-send me-2"></i>
                  Send Message
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;