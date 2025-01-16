import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { signInWithPopup, GoogleAuthProvider } from '@firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Signup = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // User signed up successfully
      console.log('Signed up user:', result.user);
      navigate('/'); // Navigate to dashboard after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Row className="w-100" style={{ maxWidth: '400px' }}>
        <Col>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="text-center">
                <Button 
                  variant="outline-dark" 
                  className="w-100 mb-3"
                  onClick={handleGoogleSignUp}
                >
                  <FcGoogle className="me-2" size={20} />
                  Sign up with Google
                </Button>
              </div>

              <div className="text-center mt-3">
                Already have an account? <a href="/login">Log In</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;