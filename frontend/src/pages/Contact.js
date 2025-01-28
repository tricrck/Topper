import React, { useState, useRef } from 'react';
import { 
  Form, Button, Container, Row, Col, 
  Card, Alert, Spinner, FloatingLabel 
} from 'react-bootstrap';
import { 
  Mail, MessageSquare, User, Send, 
  Facebook, Instagram, Github, Phone 
} from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
    setSubmitting(true);
    
    emailjs
      .sendForm('service_robfegs', 'template_5mn8j66', form.current, {
        publicKey: 'msPpvIVCXTIzEVGOD',
      })
      .then(
        () => {
          setSubmitting(false);
          setShowSuccess(true);
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
    
  };

  const SocialLink = ({ href, icon: Icon, color, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-decoration-none d-flex align-items-center gap-2 p-3 rounded-3 hover-bg-${color} transition`}
      style={{ width: 'fit-content' }}
    >
      <Icon className={`text-${color}`} size={24} />
      <span className="d-none d-md-inline">{label}</span>
    </a>
  );

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8} className="text-center">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
            <Mail size={40} className="text-primary" />
            <h1 className="display-5 mb-0">Let's Connect</h1>
          </div>
          <p className="text-muted lead">
            Have a question or want to collaborate? Drop me a message!
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center g-5">
        {/* Contact Form */}
        <Col md={7} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4 p-xl-5">
              {showSuccess && (
                <Alert 
                  variant="success" 
                  dismissible 
                  onClose={() => setShowSuccess(false)}
                  className="rounded-3"
                >
                  Message sent successfully! I'll respond within 24 hours.
                </Alert>
              )}

              <Form ref={form} onSubmit={handleSubmit}>
                <FloatingLabel controlId="from_name" label="Your Name" className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    name="from_name"
                    required
                  />
                  <User size={20} className="text-muted position-absolute top-50 end-0 translate-middle-y me-3" />
                </FloatingLabel>

                <FloatingLabel controlId="from_email" label="Email Address" className="mb-4">
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    name="from_email"
                    required
                  />
                  <Mail size={20} className="text-muted position-absolute top-50 end-0 translate-middle-y me-3" />
                </FloatingLabel>

                <FloatingLabel controlId="message" label="Your Message">
                  <Form.Control
                    as="textarea"
                    style={{ height: '150px' }}
                    placeholder="Enter your message"
                    name="message"
                    required
                  />
                  <MessageSquare size={20} className="text-muted position-absolute top-50 end-0 translate-middle-y me-3" />
                </FloatingLabel>

                <div className="text-center mt-5">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={submitting}
                    className="d-flex align-items-center gap-2 mx-auto px-5"
                  >
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Social Links */}
        <Col sm={1} md={1} lg={4}>
          <Card className="shadow-lg border-0 h-100">
            <Card.Body className="p-4 p-xl-5 d-flex flex-column justify-content-center">
              <h5 className="mb-4 text-center">Or connect directly via</h5>
              <div className="d-flex flex-column gap-3 align-items-start">
                <SocialLink
                  href="https://facebook.com/tricroc/"
                  icon={Facebook}
                  color="primary"
                  label="Facebook"
                />
                <SocialLink
                  href="https://instagram.com/tricrck"
                  icon={Instagram}
                  color="danger"
                  label="Instagram"
                />
                <SocialLink
                  href="https://github.com/tricrck"
                  icon={Github}
                  color="dark"
                  label="GitHub"
                />
                <SocialLink
                  href="https://wa.me/+254716046006"
                  icon={Phone}
                  color="success"
                  label="WhatsApp"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;